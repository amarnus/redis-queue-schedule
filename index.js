'use strict';

const redis = require('redis');
const debug = require('debug')('app:index');

const MoverService = require('./mover');
const QueueService = require('./queue');
const SchedulerService = require('./scheduler');
const ProducerService = require('./producer');
const ConsumerService = require('./consumer');

const redisClient = redis.createClient();
const queueService = new QueueService(redisClient, true);
const queueService2 = new QueueService(redisClient, false);
const moverService = new MoverService(redisClient, queueService);
const schedulerService = new SchedulerService(redisClient, moverService);
const producerService = new ProducerService(queueService);
const consumerService = new ConsumerService(queueService2);

producerService.produce();
schedulerService.run();
consumerService.consume();
