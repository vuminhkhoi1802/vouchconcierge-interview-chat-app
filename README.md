## Q&A From the Test
- Date of submission: **November 23rd 2023**
- Time spent: **35 hours+**

## Description
Here are my first assumptions from reading the test
- Upon reading the basic requirements, I understood that you are expecting a working chat application (tailored for mobile device UI as I could see from the FIGMA file)
- As it is a chat application, you are also expecting it to support multiple users in a chat room. 
- Also, all the past messages must be stored and display upon joining the correct room Id

Thus, I had made decisions below on selecting the technology for this test
- Backend: I picked `NestJS`
  - The Good:
    - Comprehensive framework and suitable for all kinds of backend project, and having the built-in `Typescript` support
    - Built-in supports for middleware, exception filters, pipes, guards, interceptors, GraphQL, WebSockets, and many other components.
    - Modular structure which helps developers to have seamless and maintainable code structure.
  - The Not So Good:
    - NestJS is also a complex framework, and can be a bit overkill for this kind of project, and it may lead to heavy application size
    - If not handled properly, the circular dependency can become a huge issue with this.
- Frontend: I picked `NextJS`
  - The Good:
    - Serverside Rendering: to boost the performance of the chat application, and can also help support with SEO
    - Structured code base (similar reason as to pick NestJS for the backend counterpart)
  - The Not So Good:
    - Not many plugins support NextJS besides Gatsby, Vercel, etc.
    - No built-in global state manager
- Database: `MongoDB` is required as indicated from the test
- Communication Protocol: `SocketIO` for backend and `SocketIO Client` for the Frontend

### Improvement Notes (In order to have this good for production)
- Needed to add unit testing and integration testing in the future (with > 70% coverage)
- A proper CI/CD pipeline with splitted environments: `dev, stage, prod`
- I haven't tested with large number of users, but in order to scale with > 1000 users, there are some improvements I believe we could use
  - Apply Redis Caching on certain parts (message storage, message reload).
  - When deploying multiple regions, the CDN (Content Delivery Network) should also be applied in order to ensure same/similar experience across the globe
- For security, I believe followings can be applied
  - Limit concurrent connections (avoid DDOS-ing)
  - End-to-end encryption (Simlar to What Telegram is using [MTProto 2.0](https://core.telegram.org/api/end-to-end))
- Need a lot of improvements on CSS and Responsive UI, see my demo video below.

### My feedback
- I believe this is a good test to testify the ability of a software engineer/developer on how one can build an end-to-end chat application within not so much time given.
## Demo Video
https://www.loom.com/share/62e4d474cd94474abce3277c33cd526f?sid=2771a803-3184-4396-a739-a146dd4f4a4e

## How to run?
- Please ensure you do have the latest version of `Docker` installed in your machine
- Backend (From the root folder)
```shell 
$ docker compose build

$ docker compose up
```
- Frontend (do execute `$cd fe` beforehand)

```shell
$ docker compose build

$ docker compose up
```

- For the Frontend application, if you struggle to run it via `Docker`, I believe you can just run it in the old fashion way

```shell
$ npm insta
$ npm run build
$ npm run start
```