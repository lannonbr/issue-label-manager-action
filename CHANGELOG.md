# 4.0.0 - November 25, 2022

- breaking: Updated action to use node 16.x

# 3.0.1 - March 5, 2022

- fix: When comparing labels, the action will no longer care about case sensitivity (ex: `label` and `Label` will be treated as the same).

# 3.0.0 - May 29, 2021

- breaking: Switched default behavior to not delete default labels. To enable this, set `delete` input to true
- chore: Moved from parcel to NCC for bundling the code down
- fix: no longer tries to update if the label didn't have a description
- chore: Updated dependencies

# 2.0.0 - August 25, 2019

- feat: Updated to JS Actions syntax. Removed Dockerfile and switched to action.yml with bundled version of package using parcel

# 1.1.0 - February 19, 2019

- feat: When inserting a color in a hexcode syntax, having a # in front of it will work as expected

# 1.0.0 - February 11, 2019

Initial Release
