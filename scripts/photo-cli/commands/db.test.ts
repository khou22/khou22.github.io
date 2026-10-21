/** @jest-environment node */
import { runCli } from "../cli";
import {
  ALPHA,
  captureOutput,
  dbState,
  Fixture,
  setupFixture,
  teardownFixture,
} from "../__fixtures__/setup";
import { connectToPhotoDb } from "@/data/photos/photoDbManager";

jest.mock("@/utils/cdn/cdnAssets.generated", () =>
  jest.requireActual("../__fixtures__/assetMap"),
);

let fixture: Fixture;
let output: ReturnType<typeof captureOutput>;
beforeEach(async () => {
  fixture = await setupFixture();
  output = captureOutput();
});
afterEach(async () => {
  output.restore();
  await teardownFixture(fixture);
});

const addCorruptRows = async () => {
  const db = await connectToPhotoDb();
  await db.run(
    `INSERT INTO photo_tags VALUES ('photography/Gone_jpg', 'category_city')`,
  );
  await db.run(`INSERT INTO photo_tags VALUES (?, 'category_bogus')`, [ALPHA]);
  await db.run(`INSERT INTO photo_metadata VALUES ('photography/Gone_jpg', 4)`);
  await db.run(
    `INSERT INTO photo_metadata VALUES ('photography/Rated_Only_jpg', 1)`,
  );
  await db.close();
};

describe("clean-db", () => {
  it("reports nothing on a clean DB", async () => {
    expect(await runCli(["clean-db"])).toBe(0);
    expect(output.stdout()).toMatch(/Found 0 unknown photo IDs/);
    expect(output.stdout()).toMatch(/Found 0 invalid tags/);
    expect(output.stdout()).not.toMatch(/--no-dry-run/);
  });

  it("reports corrupt rows without deleting in a dry run", async () => {
    await addCorruptRows();
    const before = await dbState();
    expect(await runCli(["clean-db"])).toBe(0);
    expect(output.stdout()).toMatch(
      /Found 2 unknown photo IDs:\n\tphotography\/Gone_jpg\n\tphotography\/Rated_Only_jpg/,
    );
    expect(output.stdout()).toMatch(/Found 1 invalid tags:\n\tcategory_bogus/);
    expect(output.stdout()).toMatch(/--no-dry-run/);
    expect(await dbState()).toEqual(
      expect.objectContaining({ tags: before.tags, ratings: before.ratings }),
    );
  });

  it("deletes corrupt rows with --no-dry-run", async () => {
    await addCorruptRows();
    expect(await runCli(["clean-db", "--no-dry-run"])).toBe(0);
    expect(output.stdout()).toMatch(/Deleted 2 tag rows and 2 metadata rows/);
    const state = await dbState();
    expect(state.tagsFor("photography/Gone_jpg")).toEqual([]);
    expect(state.tagsFor(ALPHA)).toEqual([
      "category_landscape",
      "location_san_francisco",
      "other_featured",
    ]);
    expect(state.ratings).toHaveLength(3);
  });
});
