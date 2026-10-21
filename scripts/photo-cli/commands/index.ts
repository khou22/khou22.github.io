import { Command } from "../lib/args";
import { list, show, subdirs, tags } from "./browse";
import { cleanDb } from "./db";
import { move, remove } from "./files";
import { assets, clean, ingest, resize, thumbnails } from "./images";
import { category, location, rate, sell, tag } from "./metadata";

/**
 * All CLI commands, in the order they appear in `--help`.
 */
export const commands: Record<string, Command> = {
  list,
  show,
  tags,
  subdirs,
  tag,
  category,
  location,
  sell,
  rate,
  move,
  delete: remove,
  "clean-db": cleanDb,
  clean,
  thumbnails,
  resize,
  assets,
  ingest,
};
