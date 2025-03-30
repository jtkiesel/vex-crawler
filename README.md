# vex-crawler

Node.js application that obtains VEX Robotics Competition data from a variety of sources.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

- [Node.js](https://nodejs.org)
- [PostgreSQL](https://postgresql.org)

### Environment Variables

|       Variable       | Required |                     Default                     |           Description            |
| :------------------: | :------: | :---------------------------------------------: | :------------------------------: |
|    `DATABASE_URL`    |          | `postgres://localhost:5432/vexstats?schema=vex` | PostgreSQL server connection URI |
| `ROBOT_EVENTS_TOKEN` |          |                                                 |      Robot Events API token      |

### Installing

Install dependencies

```shell
npm install
```

Start the app

```shell
npm run dev
```

## Deployment

Install dependencies

```shell
npm install
```

Compile source

```shell
npm run build
```

Start the app

```shell
npm start
```

## Authors

- **Jordan Kiesel** - [LinkedIn](https://linkedin.com/in/jtkiesel)

See also the list of [contributors](https://github.com/jtkiesel/vex-crawler/contributors) who participated in this project.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
