# Contributing Guidelines
## Branches
- `main`: Always stable. Production builds happen from here.
- `dev`: All new work is merged here first.
## Contributing Workflow
1. Checkout `dev` and pull latest changes
2. Create a new branch from `dev`:
   - `feature/xyz`: New feature
   - `fix/xyz`: Bugfix
3. Push your branch and open a PR into `dev`
4. Once tested, open a PR from `dev` → `main` to trigger a production release
## Commit Style
As of v1, ds-chef will adhere to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) and begin using more tightly-scoped commits rather than bundled ones. Don't overthink it, pick whatever feels close enough.
- `feat: add login button`
- `fix: correct scroll behavior`
- `refactor: simplify layout`
- `docs: fix typo in CONTRIBUTING guide`,
- `chore:` - for any misc. upkeep like configs 
- `style:` - code style—not CSS

## Procedures for maintainers
### Releasing `dev` to `main` (production)
1. Ensure `dev` is clean/up to date
    ```
    git checkout dev
    git pull origin dev
    ```
2. Before merging to main, it's important to bump the version in package.json and others since it's displayed in the app. This will automatically create a tagged commit. 
    ```bash
    npm version <newversion> | minor | patch
    ```
3. Merge `dev` to `main` and test the app locally.
    ```bash
    git checkout main
    git pull origin main
    git merge dev
    ```
4. Push changes and tag
    ```
    git push origin main
    git push origin v1.x.x # only if the tag wasn’t pushed automatically, otherwise unnecessary
    ```
5. Create a GitHub release with changelog/description
