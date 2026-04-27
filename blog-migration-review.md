# Blog Migration Review

Review of 70 posts touched by migration commit `735848b`. Each entry has space for a comment and a status checkbox so you can resolve them inline.

**Status legend:**
- `[ ]` — not yet addressed
- `[x]` — resolved
- `[~]` — won't fix / accepted as-is

---

## 🔴 High severity — actual bugs or broken rendering

### 1. Duplicate ML code snippets posts
- **Files:** `2018-06-14-machine-learning-code-snippets-june-2018.md` and `2018-06-29-machine-learning-code-snippets-june-2018.md`
- **Severity:** High
- **Description:** Diffed both files — they're near-identical duplicates. Only differences: date, description text, tag order, and `####` vs `###` heading levels. Both contain the same broken section heading `## Getting an Overview of a DataFrame (Make this into another` (cut-off TODO). Recommend deleting the June 29 version and keeping June 14.
- **Status:** [ ]
- **Comment:**

### 2. Duplicate "Tigers for Nassau" posts
- **Files:** `2020-06-14-the-nassau-we-all-love-student-group-aims-to-help-keep-town-businesses-afloat-amid-covid-19.md` and `tigers-for-nassau-daily-princetonian.md`
- **Severity:** High
- **Description:** Both link to the same Daily Princetonian article. The dated one is a single-line stub. The undated `tigers-for-nassau-daily-princetonian.md` has excerpts and uses the proper `link` frontmatter field. Recommend deleting the dated stub.
- **Status:** [ ]
- **Comment:**

### 3. Broken recursion code example
- **File:** `2018-06-15-algorithm-best-practices-june-2018-recrusive-tree-search-functions.md`
- **Severity:** High
- **Description:** The Python example doesn't run.
  - Line 54: `~hasChildren(element)` uses bitwise NOT — always truthy. Should be `not hasChildren(element)`.
  - Line 60: `visitor(node)` passes one arg but visitor signature takes two (`element, accumulator`).
  - Lines 63–64: `hasChildren(element)` and `element['children']` reference undefined `element`; the parameter is `node`.
  - Bonus: title typo "Recrusive" → "Recursive".
- **Status:** [ ]
- **Comment:**

### 4. Wrong setTimeout callback pattern
- **File:** `2015-07-31-clearing-timeouts-and-intervals-before-they-trigger.md`
- **Severity:** High
- **Description:** Line 22: `setTimeout(functionName(), 500)` invokes the function immediately instead of passing it as a callback. Should be `setTimeout(functionName, 500)`. Also: line 15 has `module.export` (missing `s`) and `React. createClass` (stray space). The whole tutorial teaches the wrong pattern.
- **Status:** [ ]
- **Comment:**

### 5. Broken inline code fence
- **File:** `2018-06-22-terminal-tips-and-tricks-june-2018-json-data-caffeinate-and-more.md`
- **Severity:** High
- **Description:** Line 96: `` `$ head -1 data_set/background-one.csv | sed 's/[^,]//g' | wc -c$ `` — closing backtick missing, trailing `$` instead. Will render as raw text from there to the next backtick on the page.
- **Status:** [ ]
- **Comment:**

### 6. Unclosed JSX in code block
- **File:** `2017-06-14-es6-tips-and-tricks-june-2017imports-functions-and-more.md`
- **Severity:** High
- **Description:** Line 79: `<button id="button" onClick={this.clicked(input)}>` has no closing `</button>` inside the JSX example. It's intended as a "wrong example" demo, but the JSX won't even parse — confusing for anyone copying.
- **Status:** [ ]
- **Comment:**

### 7. Localhost link in vim post
- **File:** `2017-08-03-introduction-to-vim-transitioning-to-command-line-text-editing.md`
- **Severity:** High
- **Description:** Line 20: link points to `http://localhost:4000/programming/2017/08/04/my-custom-vim-configuration-installation-usage-and-capabilities.html` — accidentally migrated dev URL. Will 404 for any reader. Should be `/blog/2017-08-04-my-custom-vim-configuration-...` or similar.
- **Status:** [ ]
- **Comment:**

### 8. Wrong link target for Redux course
- **File:** `2017-06-13-intro-to-redux-getting-started-with-state-containers-in-react.md`
- **Severity:** High
- **Description:** Line 126: link text says "free course on egghead.io on Redux and React" but the URL is `http://webpack.github.io/docs/tutorials/getting-started/` — webpack docs, wrong target entirely.
- **Status:** [ ]
- **Comment:**

### 9. `module.exports` typo breaks Node example
- **File:** `2015-10-25-nodejs-basics---setting-up-a-local-web-server.md`
- **Severity:** High
- **Description:** Line 64: `module.export.data` should be `module.exports.data`. Code as written will silently fail — `module.export` is undefined.
- **Status:** [ ]
- **Comment:**

### 10. Invalid CSS in media-queries example
- **File:** `2015-08-03-intro-to-media-queries.md`
- **Severity:** High
- **Description:** Lines 16, 19: extra `;` after closing `}` — invalid CSS. Readers copying the snippet will inherit the bug.
- **Status:** [ ]
- **Comment:**

### 11. Stray label inside CSS code block
- **File:** `2016-01-14-how-to-build-a-dropdown-menu-using-pure-html-and-css.md`
- **Severity:** High
- **Description:** Line 33: literal text `CSS:` appears as the first line inside the CSS code fence. Migration leftover — looks like a label that should have been a markdown heading was pulled into the block.
- **Status:** [ ]
- **Comment:**

### 12. Code fence language mismatch
- **File:** `2015-07-29-installing-packages-on-sublime-text-2.md`
- **Severity:** High
- **Description:** Line 14: code block tagged ` ```javascript ` but contains Python (`urllib2`, `hashlib`). Wrong syntax highlighting will render. Also typo "Rich Text Formal" → "Format".
- **Status:** [ ]
- **Comment:**

---

## 🟡 Medium severity — stub / incomplete posts

### 13. Stub: woodturning bowl post
- **File:** `2016-05-20-making-a-wood-turned-segmented-bowl-with-inlaid-letters.md`
- **Severity:** Medium
- **Description:** Line 11: bold disclaimer `**Blog post is currently unfinished**`. Post has only 3 sentences of intro. Either finish it, delete it, or move to drafts.
- **Status:** [ ]
- **Comment:**

### 14. "In progress" marker on i18n post
- **File:** `2016-06-20-internationalizing-your-ios-app-in-xcode-7.md`
- **Severity:** Medium
- **Description:** Line 11: `*** This is a blog post in progress ***`. Content is actually fairly complete — just remove the marker line.
- **Status:** [ ]
- **Comment:**

### 15. Cut-off heading in ML snippets
- **Files:** `2018-06-14-machine-learning-code-snippets-june-2018.md` and `2018-06-29-machine-learning-code-snippets-june-2018.md`
- **Severity:** Medium
- **Description:** Both have line 59: `## Getting an Overview of a DataFrame (Make this into another` — a TODO note that escaped into production. Truncate the heading to "Getting an Overview of a DataFrame" or finish the idea. (Likely resolved by Issue #1's deduplication.)
- **Status:** [ ]
- **Comment:**

### 16. CNC router post is bullet-list scratch notes
- **File:** `2016-03-06-getting-started-with-the-cnc-router.md`
- **Severity:** Medium
- **Description:** No narrative — reads like personal notes. Functional but feels unfinished. Decide: flesh out, or accept as-is.
- **Status:** [ ]
- **Comment:**

---

## 🟡 Medium severity — outdated content

### 17. Post about deprecated React API with no notice
- **File:** `2015-08-03-react-lifecycle-event-componentwillreceiveprops.md`
- **Severity:** Medium
- **Description:** Whole post is about `componentWillReceiveProps`, which was removed in React 17. No deprecation banner. A 2026 reader will get errors. Add a note at the top, or archive.
- **Status:** [ ]
- **Comment:**

### 18. Posts using `React.createClass` / `getInitialState`
- **Files:** `2015-07-16-common-react-issue---button-clicks.md`, `2015-07-17-css3-animation-basics-and-callback-solutions.md`
- **Severity:** Medium
- **Description:** Both teach `React.createClass()` and `getInitialState`, gone since React 16. Still readable as historical context but consider top-of-post note.
- **Status:** [ ]
- **Comment:**

### 19. Outdated "React requires self-closing tags" claim
- **File:** `2015-10-17-reading-a-text-file-using-html-and-javascript.md`
- **Severity:** Medium
- **Description:** Line 23 states React only recognizes 'complete' tags. No longer accurate (and was always overstated).
- **Status:** [ ]
- **Comment:**

### 20. Python 2 docs link + orphaned word
- **File:** `2016-01-31-installing-and-getting-started-with-python.md`
- **Severity:** Medium
- **Description:** Line 47 links to Python 2 docs (`docs.python.org/2/library/json.html`). Line 16 has an orphaned `so` on its own line — migration artifact between two paragraphs.
- **Status:** [ ]
- **Comment:**

### 21. Self-contradicting MusicViz post
- **File:** `2015-03-10-musicviz-demo-with-goooo-by-tnght.md`
- **Severity:** Medium
- **Description:** Line 12 says "Java with the Minim library." Line 24 says "I coded this entirely with Processing." Pick one. Also links to dead `http://kevinhou.wix.com/projects`.
- **Status:** [ ]
- **Comment:**

### 22. Dead Wix links in first post
- **File:** `2015-08-04-first-post.md`
- **Severity:** Medium
- **Description:** Lines 17 link to `http://kevinhou.wix.com/projects` and `/blog`. Likely dead.
- **Status:** [ ]
- **Comment:**

---

## 🟡 Medium severity — broken cross-links between blog posts

### 23. Internal link to non-migrated post (segmented control)
- **File:** `2016-07-26-swift-segmented-control-basics-how-to-setup-and-utilize-segmented-controls.md`
- **Severity:** Medium
- **Description:** Line 55 links to `http://khou22.github.io/programming/2016/06/28/making-a-simple-page-based-application-in-swift.html` — that target post does not exist in the migrated set. Will 404. Either migrate the target post or rewrite the link.
- **Status:** [ ]
- **Comment:**

### 24. Internal link to non-migrated post (swift navigation)
- **File:** `2016-08-03-swift-tips-and-tricks-august-2016-app-navigation-and-dates.md`
- **Severity:** Medium
- **Description:** Same broken target as above (`making-a-simple-page-based-application-in-swift.html`).
- **Status:** [ ]
- **Comment:**

### 25. Old Jekyll-style blog cross-links
- **Files:** `2016-07-21-xcode-best-practices-...md`, `2016-07-25-persist-data-...md`, `2015-11-29-theaterjs-...md`
- **Severity:** Medium
- **Description:** All link to other blog posts via `http://khou22.github.io/programming/YYYY/MM/DD/slug.html` Jekyll permalink format. New site uses `/blog/[slug]`. Links may resolve via redirects, but should be updated to the new format.
- **Status:** [ ]
- **Comment:**

### 26. Broken in-domain link + malformed tooltip
- **File:** `2015-11-01-text-analysis-app-how-do-you-talk-to-people-on-facebook-versus-in-an-engineering-report.md`
- **Severity:** Medium
- **Description:** Line 15 links to `http://khou22.github.io/blog/apps/text-analysis` (likely dead). Line 27 has `[writing grade level](# "See the Flesch-Kincaid Grade Level formula")` — bare `#` href acts as a broken anchor; the tooltip syntax doesn't render in react-markdown the way Jekyll did.
- **Status:** [ ]
- **Comment:**

---

## 🟢 Low severity — image / URL hygiene

### 27. Hardcoded `khou22.github.io` image URLs
- **Files:** ~20 posts
- **Severity:** Low
- **Description:** Most migrated posts hardcode images as `https://khou22.github.io/media/blog/images/...`. Works today but couples content to the prod hostname. Consider bulk-rewriting to `/media/blog/images/...` (relative).
- **Status:** [ ]
- **Comment:**

### 28. Unencoded spaces in image paths
- **Files:**
  - `2015-12-25-os-x-shortcuts-and-productivity-hacks.md` — `Faster Mac Dock Reveal.png`
  - `2016-05-07-designing-my-youtube-channel-artwork.md` — `YouTube Channel Artwork/Desktop Size.png`, `YouTube Channel Artwork.jpg`
- **Severity:** Low
- **Description:** Spaces in URLs not URL-encoded. May render inconsistently across browsers/CDNs.
- **Status:** [ ]
- **Comment:**

### 29. Inconsistent `%20`-encoded image URLs
- **Files:** `2015-10-09-jekyll-on-el-capitan-osx-1011.md`, `2016-05-01-github-octocat-design-challenge-winner.md`
- **Severity:** Low
- **Description:** These work but inconsistent with rest of corpus. Consider renaming files to drop the spaces, or normalize all image filenames.
- **Status:** [ ]
- **Comment:**

### 30. http:// links that should be https://
- **Files:** various — `2015-08-02-best-way-to-customize-terminal.md`, `2016-06-20-internationalizing-...md`, `2016-07-26-swift-segmented-control-...md`, `2016-08-28-design-tips-...svg-images.md`, `2017-02-28-swift-tips-...force-touch-app-shortcuts.md`
- **Severity:** Low
- **Description:** Several external links use `http://` for sites that now serve https (raw.github.com → raw.githubusercontent.com, ioscreator.com, samwize.com, cubic-bezier.com, fullscreensoftware.blogspot.co.il). Most will redirect, some may break in modern browsers due to mixed-content.
- **Status:** [ ]
- **Comment:**

---

## 🟢 Low severity — typos

### 31. Typos sweep
- **Severity:** Low
- **Description:** Easy fixes across multiple posts:
  - `2015-07-17-css3-animation-basics-...md` — "wtih" → "with"
  - `2015-07-21-quick-short-ifthen-statement.md` — "readabitlity" → "readability"; "realistate" → "real estate"
  - `2015-07-24-using-javascript-variables-...md` — "inconvienient" → "inconvenient"
  - `2015-07-29-installing-packages-...md` — "Rich Text Formal" → "Format"
  - `2015-08-03-react-lifecycle-event-componentwillreceiveprops.md` — "jsut" → "just"
  - `2015-10-01-visualizing-a-javascript-callback.md` — "asyncrhonis" → "asynchronous"
  - `2015-10-25-nodejs-basics-...md` — "sytem" → "system"; "almsot" → "almost"
  - `2015-11-29-theaterjs-...md` — "pleathorea" → "plethora"; "elegeant" → "elegant"
  - `2018-09-18-skill-shift-...md` — "emootional" → "emotional"; "huage" → "huge"
- **Status:** [ ]
- **Comment:**

---

## 🟢 Low severity — frontmatter inconsistency

### 32. Title/date month mismatch
- **File:** `2017-07-31-es6-tips-and-tricks-june-2017-webpack-configuration-regexes-and-dns-configuration.md`
- **Severity:** Low
- **Description:** Title says "June 2017" but date is `2017-07-31`. Either fix the title or accept that posts roll up monthly content.
- **Status:** [ ]
- **Comment:**

### 33. Missing `featured` field
- **File:** `2015-07-31-clearing-timeouts-and-intervals-before-they-trigger.md`
- **Severity:** Low
- **Description:** Missing `featured: false`. Parser handles absence (`|| false`), but inconsistent with rest of corpus.
- **Status:** [ ]
- **Comment:**

---

## 🔵 Optional — merge candidates (very short same-topic clusters)

### 34. Merge: terminal customization (2 posts)
- **Files:** `2015-08-02-best-way-to-customize-terminal.md`, `2015-08-02-changing-your-terminal-prompt.md`
- **Severity:** Optional / cleanup
- **Description:** Same week, both very short, both about terminal config (oh-my-zsh + iTerm vs. `.bash_profile` PS1). Combine into one "Customizing Your Terminal" post with two sections.
- **Status:** [ ]
- **Comment:**

### 35. Merge: Sublime Text setup (2 posts)
- **Files:** `2015-07-29-installing-packages-on-sublime-text-2.md`, `2015-09-12-react-syntax-highlighting-in-sublime-text-editor-babel-sublime.md`
- **Severity:** Optional / cleanup
- **Description:** Both very short, both Sublime Text setup. Combine into "Sublime Text Setup: Package Control & Babel/JSX Highlighting".
- **Status:** [ ]
- **Comment:**

### 36. Merge: macOS productivity (3 posts)
- **Files:** `2015-08-16-small-lessons-disabling-scrolling-extra-screen-sizes-mirroring-and-screen-arrangement-tricks.md`, `2015-08-17-cropping-square-images-in-mac-preview.md`, `2015-12-25-os-x-shortcuts-and-productivity-hacks.md`
- **Severity:** Optional / cleanup
- **Description:** All macOS tips/shortcuts. The Dec 25 one is already medium-sized — make it the destination and fold the other two in.
- **Status:** [ ]
- **Comment:**

### 37. Merge: tiny CSS snippets (3 posts)
- **Files:** `2015-08-03-intro-to-media-queries.md`, `2015-08-03-setting-a-background-image-with-html-and-css.md`, `2015-08-17-css-filters-and-effects.md`
- **Severity:** Optional / cleanup
- **Description:** All very short, all CSS snippets. Combine into "CSS Quick Reference: Media Queries, Backgrounds, Filters". Note: doing this would also resolve Issue #10 (the broken media query CSS).
- **Status:** [ ]
- **Comment:**

### 38. Merge: music visualizer demos (2 posts)
- **Files:** `2015-03-10-musicviz-demo-with-goooo-by-tnght.md`, `2015-03-11-jubel---musicviz-demo.md`
- **Severity:** Optional / cleanup
- **Description:** Two days apart, both very short, both music visualizer demos. Combine into one post with both videos. Resolves Issue #21 (the Java/Processing contradiction) by writing one definitive description.
- **Status:** [ ]
- **Comment:**

---

## Summary

| Severity | Count |
|---|---|
| 🔴 High (bugs, broken rendering) | 12 |
| 🟡 Medium (incomplete, outdated, broken cross-links) | 14 |
| 🟢 Low (image hygiene, typos, frontmatter) | 7 |
| 🔵 Optional merges | 5 |
| **Total issues** | **38** |
