
# About

This is a library that provides code utilities for social media applications. Some utilities it provides are as follows:

1) A method `getMixedFeedPosts` that mixes posts a user created and posts that user has liked in an alternating fashion. It runs in linear time.
2) A method `mixByOwners` that mixes posts created by various users in a round robin fashion. It runs in linear time.

# Design

## Source Code
1) This is an es6 based program
2) The code is heavily documented with `jsdoc` and has strong `jsdoc typing`.
3) The code uses `carmel and pascal case`, a style heavily used in javascript development as compared to `underscore case` in php and python
4) It efficiently uses a mixture of composition and inheritance to implement data abstraction and make the code more cohesive. For example, the `mysql/posts/posts.js` is a mysql based extension of a more generalized `models/posts/base-posts.js`.

## Time Complexity
In the `models/posts/mixed-posts.js` class, The methods `mixByOwners()` and `getMixedFeedPosts()` use the method `mixBy()` which runs in O(N) time. More details can be found in program documentation.

# Setup & Testing
1) install dependencies using `npm install`
2) create a test database and run all queries in `tests/db.sql` to build the database schema. Be warned that any information in the test database can be deleted at any time.
3) set mysql connection details in `tests/connection.js` 
4) run the tests using `npm run test`
