## Node Express Microservices 

As part of my learning, I have created this simple app to get hands-on expereince on implementing microservices architecture. 

Developed a chat app with microservices architecture
Technologies used: Typescript, Nodejs, Express, MongoDB RabbitMq and Firebase

__user-service__: Developed Rest APIs for user registeration, login and logout. Used RabbitMq to listen to the requests and send the user details to the queue which will be consumed by the chat-service

__chat-service__: Developed Rest APIs for sending and receiving messages. Used RabbitMq to consume the user details and notify the the notification service thourgh notifications queue.

__notification-service__: Used RabbitMq to consume the notification details from notification queue and then send email notification throug ethereal and push notification thorugh firebase cloud messaging service.

__api-gateway__: Act as the gateway to route the users to different services. 

__client-fcm__ : A react client for generating firebace cloud messaging token and use it in the chat service to send to the notification queue for testing push notification.
