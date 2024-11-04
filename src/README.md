You can run redpanda console with the following command. Make sure to change the relative path on the host to point to your systems path.[`~/Developer/node/test-kafka-glue/kafka-glue/src/redpanda-console-config.yaml`]

```bash
docker run -p 8080:8080 \
-v ~/Developer/node/test-kafka-glue/kafka-glue/src/redpanda-console-config.yaml:/etc/redpanda/redpanda-console-config.yaml \
-e CONFIG_FILEPATH=/etc/redpanda/redpanda-console-config.yaml \
docker.redpanda.com/redpandadata/console:latest

```
