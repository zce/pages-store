# pages-store

[![NPM Downloads][downloads-image]][downloads-url]
[![NPM Version][version-image]][version-url]
[![License][license-image]][license-url]
[![Dependency Status][dependency-image]][dependency-url]
[![devDependency Status][devdependency-image]][devdependency-url]
[![Code Style][style-image]][style-url]

> GitHub Pages Storage Adapter for Ghost

## Installation

### Via Yarn or NPM

- Install pages-store module

  ```shell
  yarn add pages-store
  # or npm
  npm install pages-store
  ```
- Make the storage folder if it doesn't exist yet

  ```shell
  mkdir -p content/adapters/storage
  ```
- Copy the module into the right location

  ```shell
  cp -vR node_modules/pages-store content/adapters/storage/pages-store
  ```

### Via Git

In order to replace the storage module, the basic requirements are:

- Create a new folder inside `content/adapters` called `storage`

- Clone this repo to `storage`

  ```shell
  cd [path/to/ghost]/content/adapters/storage
  git clone https://github.com/zce/pages-store.git
  ```

- Install dependencies

  ```shell
  cd pages-store
  yarn
  # or
  npm install
  ```

## Usage

In your `config.[env].json` file, you'll need to add a new `storage` block to whichever environment you want to change:

```json
{
  "storage": {
    "active": "pages-store",
    "pages-store": {
      "prefix": "http://zce.github.io/storage",
      "repo": "zce/storage"
    }
  }
}
```

### Options

```json
{
  "storage": {
    "active": "pages-store",
    "pages-store": {
      "prefix": "https://img.zce.me",
      "repo": "https://git.coding.net/zce/images.git",
      "branch": "master"
    }
  }
}
```

## Contributing

1. **Fork** it on GitHub!
2. **Clone** the fork to your own machine.
3. **Checkout** your feature branch: `git checkout -b my-awesome-feature`
4. **Commit** your changes to your own branch: `git commit -am 'Add some feature'`
5. **Push** your work back up to your fork: `git push -u origin my-awesome-feature`
6. Submit a **Pull Request** so that we can review your changes.

> **NOTE**: Be sure to merge the latest from "upstream" before making a pull request!

## License

[MIT](LICENSE) &copy; 汪磊(https://zce.me/)



[downloads-image]: https://img.shields.io/npm/dm/pages-store.svg
[downloads-url]: https://npmjs.org/package/pages-store
[version-image]: https://img.shields.io/npm/v/pages-store.svg
[version-url]: https://npmjs.org/package/pages-store
[license-image]: https://img.shields.io/npm/l/pages-store.svg
[license-url]: https://github.com/zce/pages-store/blob/master/LICENSE
[dependency-image]: https://img.shields.io/david/zce/pages-store.svg
[dependency-url]: https://david-dm.org/zce/pages-store
[devdependency-image]: https://img.shields.io/david/dev/zce/pages-store.svg
[devdependency-url]: https://david-dm.org/zce/pages-store?type=dev
[style-image]: https://img.shields.io/badge/code_style-standard-brightgreen.svg
[style-url]: http://standardjs.com
