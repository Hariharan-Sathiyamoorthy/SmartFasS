

# Mitigating Serverless Cold Start Latency with Predictive Function Invocation and Adaptive Caching



## Prerequisites

- Node.js
- JMeter
- Docker
- redis

## Setup

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies:
    ```sh
    npm install
    ```

## Usage

Run the desired script using the `npm run` command followed by the script name.

Example:
```sh
npm run orchestrate
```


## Scripts

### Cold Mitigation

```sh
npm run coldMitigation
```

This script runs the `orchestrate` function and performs load testing using JMeter. The output is logged to `./logs/output_node.log` and `./logs/output_jmeter.log`.


### OpenWhisk

```sh
npm run OpenWhisk
```

This script runs a JMeter load test using the `openWhiskScript.jmx` file. The output is logged to `./logs/output_jmeter.log`. For this you need to install openwhisk localy

### Kill All

```sh
npm run killall
```

This script kills all Docker containers with the name `coldMitigation`.

### Remove All

```sh
npm run rmall
```

This script removes all stopped Docker containers.


## License

This project is licensed under the MIT License.
