---
layout: post
title: "Machine Learning Code Snippets&#58 June 2018"
author: "Kevin Hou"
date: 2018-06-14 16:05:23
description: "Useful code snippets, functions, and classes that will make you more efficient with Pandas, Numpy, and Jupyter Notebooks."
image: "./../../../../media/blog/images/Blog_Post_Placeholder_Image.jpg"
category: programming
tags: [python, sourceCode]
featured: "yes"
---
This blog post contains a number of useful code snippets, functions, and classes that will help with machine learning in Jupyter Notebooks. Specific usage instructions as well as dependencies 

## Modifying and Selecting Information from a DataFrame

#### Random Sample of Rows
Choose a random sample of rows from a large dataframe. This is very useful when trying to reduce your training set for debugging purposes.

``` python
indices = np.random.randint(10, size=2)
smallerDF = df[indices,:]
```

#### Selecting and Removing Columns
It's very easy to extract or remove columns from a pandas dataframe using their built in indexing actions.

``` python
# Extract these keys into their own data frame
preserveKeys = ['x', 'y']
smallDF = df[preserveKeys]

# Create a new dataframe without certain columns
newDF = df.drop(columns=['z'])
```

#### Converting All Non-Null Entries to 1
This is helpful when converting a dataframe into a boolean dataframe in which a 1 indicates the prescence of a value and a null indicates there was no value. It can turn any dataframe into a sort of "checkbox" which is helpful for certain types of data processing like collaborative filtering where the actual value doesn't matter.

``` python
booleanDF = copy.deepcopy(df) # Deep copy so don't modify other DF

# Convert 'np.nan' to 0's and everything else to 1's
booleanDF = booleanDF.notnull().astype('int')

# Replace all 0's with 'np.nan'
booleanDF = booleanDF.replace(0, np.nan)
```

#### Merging DataFrames
``` python
# Merge 2 dataframes with the same rows (ie. add new columns)
finalDF = pd.concat([df1, df2], sort=True)

# Merge 2 dataframes with the same columns (ie. add more rows)
finalDF = pd.concat([df1, df2], sort=True, axis=0)

# Merge 2 dataframes by row and add new columns when appropriate
finalDF = pd.concat([df1, df2], sort=True, axis=0, ignore_index=True)
```

## Getting an Overview of a DataFrame (Make this into another 
It's often difficult to deal with abstract, seemingly black-box machine learning algorithms. What can help alleviate some of this stress is knowing what your data really looks like. Here's a few examples that will help you understand what's going on in your dataset.

#### Printing Basic Excerpts
``` python
df.describe()

df.head(5) # First 5 rows
```

Running `df.describe()` will print a table of all columns and their respective counts (how many non-null values in the column), mean, std (standard deviation), min, 25%, 50%, 75%, and max. Sometimes the row name doens't get included. This can be fixed by passing in the argument "include='all'" as follows: `df.describe(include='all')`.

Running `df.head(n)` will print the first n rows of your dataset and can give you a good understanding of the form of your data. While the `describe()` function is good at showing you basic distributions, the `head()` function will show you what your data actually looks like quickly and easily.

