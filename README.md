# RedHatGov.io

[![Build Status](https://travis-ci.org/RedHatGov/redhatgov.github.io.svg?branch=docs)](https://travis-ci.org/RedHatGov/redhatgov.github.io)


----

[RedHatGov.io][redhatgov] is a great open source collection of workshop materials that
cover various topics relating to Red Hat's product portfolio.

----

## To start developing

If you want to build RedHatGov.io right away:

- You have a working [Hugo environment][hugo] - and *probably* at the correct version.
  - we keep a current working version in the `./bin/` folder
- You have Ruby and the asciidoctor gem installed (*gem install asciidoctor*)

    `$ git clone https://github.com/RedHatGov/redhatgov.github.io`

    `$ cd redhatgov.github.io`

    `$ hugo server`

## Deployment as a Container Image

In the root of this repository, you'll find a `Dockerfile` which can be used to build a container image:

```bash
podman build -t redhat-workshops .
podman run -p 8080:8080 redhat-workshops
```

Navigate your browser to http://localhost:8080 to access the running container.

## Contributing

If you have content that you'd like to contribute, check out our
[contribution guidelines for this project](CONTRIBUTING.md).

[redhatgov]: http://redhatgov.io/
[hugo]: https://gohugo.io/overview/introduction/
