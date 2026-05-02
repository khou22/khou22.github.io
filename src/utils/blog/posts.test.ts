import fs from "fs";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  getPaginatedPosts,
  getPostListPageForSlug,
  POSTS_PER_PAGE,
} from "./posts";
import { getDataDirectory } from "@/data/dataDirs";

jest.mock('fs');
jest.mock('gray-matter');
jest.mock('reading-time');
jest.mock('@/data/dataDirs');

const mockedFs = fs as jest.Mocked<typeof fs>;
const mockedMatter = matter as jest.MockedFunction<typeof matter>;
const mockedReadingTime = readingTime as jest.MockedFunction<typeof readingTime>;
const mockedGetDataDirectory = getDataDirectory as jest.MockedFunction<typeof getDataDirectory>;

describe('getPaginatedPosts', () => {
  const mockFileNames = Array.from({ length: 25 }, (_, i) => `post-${i + 1}.md`);
  
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetDataDirectory.mockReturnValue('/mock/posts');
    mockedFs.readdirSync.mockReturnValue(mockFileNames as any);
    mockedFs.readFileSync.mockReturnValue('mock content');
    mockedReadingTime.mockReturnValue({ time: 100, words: 10 } as any);
    
    // Default mock for gray-matter
    mockedMatter.mockImplementation((content) => {
        // Extract index from some context if possible, or just use a counter
        return {
            data: {
                title: 'Mock Post',
                author: 'Author',
                date: '2023-01-01',
                description: 'Description'
            },
            content: 'Mock Content'
        } as any;
    });
  });

  it('should return the first page of posts', async () => {
    // To make posts unique, we need to mock matter differently for each call if we want to test slicing perfectly.
    // But getPaginatedPosts calls getPosts which maps over all files.
    
    let counter = 0;
    mockedMatter.mockImplementation(() => {
        counter++;
        return {
            data: {
                title: `Post ${counter}`,
                author: 'Author',
                date: new Date(2023, 0, 31 - counter).toISOString(), // Descending dates
                description: 'Description'
            },
            content: 'Mock Content'
        } as any;
    });

    const result = await getPaginatedPosts(1);
    expect(result.posts.length).toBe(POSTS_PER_PAGE);
    expect(result.currentPage).toBe(1);
    expect(result.totalPages).toBe(2);
    expect(result.totalPosts).toBe(25);
  });

  it('should return the correct slice for page 2', async () => {
    let counter = 0;
    mockedMatter.mockImplementation(() => {
        counter++;
        return {
            data: {
                title: `Post ${counter}`,
                author: 'Author',
                date: new Date(2023, 0, 31 - counter).toISOString(),
                description: 'Description'
            },
            content: 'Mock Content'
        } as any;
    });

    const result = await getPaginatedPosts(2);
    expect(result.posts.length).toBe(10);
    expect(result.currentPage).toBe(2);
    // The first post on page 2 (with limit 15) should be the 16th post.
    expect(result.posts[0].frontMatter.title).toBe('Post 16');
  });

  it('should handle out-of-bounds page', async () => {
    const result = await getPaginatedPosts(10);
    expect(result.currentPage).toBe(2); // Last page
    expect(result.posts.length).toBe(10);
  });

  it('should return the page that contains a post slug', () => {
    let counter = 0;
    mockedMatter.mockImplementation(() => {
        counter++;
        return {
            data: {
                title: `Post ${counter}`,
                author: 'Author',
                date: new Date(2023, 0, 31 - counter).toISOString(),
                description: 'Description'
            },
            content: 'Mock Content'
        } as any;
    });

    expect(getPostListPageForSlug('post-1')).toBe(1);
    expect(getPostListPageForSlug('post-16')).toBe(2);
    expect(getPostListPageForSlug('missing-post')).toBeNull();
  });
});
