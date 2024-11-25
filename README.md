# Tech Tracks


Diagrama ERD


```mermaid
erDiagram
    User {
        String id
        String name
        String email
        DateTime emailVerified
        UserRole role
        String image
        DateTime createdAt
        DateTime updatedAt
    }
    Account {
        String userId
        String type
        String provider
        String providerAccountId
        String refresh_token
        String access_token
        Int expires_at
        String token_type
        String scope
        String id_token
        String session_state
        DateTime createdAt
        DateTime updatedAt
    }
    Session {
        String sessionToken
        String userId
        DateTime expires
        DateTime createdAt
        DateTime updatedAt
    }
    VerificationToken {
        String identifier
        String token
        DateTime expires
    }
    Track {
        String id
        String slug
        String badge
        String color
        DateTime created
        String description
        Int level
        LevelName level_name
        String name
        String nameAscii
        String preview
        String public_route
        Int relevance
        String scheduled
        SectionType sectionType
        SubscriptionType subscription_type
        Int total_activities
        String web_route
        Int workload
        String corporateId
        DateTime createdAt
        DateTime updatedAt
    }
    Module {
        String id
        String name
        Int total_activities
        String trackId
        DateTime createdAt
        DateTime updatedAt
    }
    Course {
        String id
        String slug
        String badge
        String description
        String first_slug
        String first_uuid
        String level
        String name
        Int total
        CourseType type
        Int workload
        Json extraInformation
        DateTime createdAt
        DateTime updatedAt
    }
    Lesson {
        String id
        String course
        String description
        Int experience
        String largeCover
        String largeCover_disabled
        String name
        String next_content
        String next_slug
        Int order
        Int workload
        String courseId
        DateTime createdAt
        DateTime updatedAt
    }
    Content {
        String id
        String slug
        Json content
        String duration
        String name
        String pdf_url
        ContentType type
        String youtubeCode
        String lessonId
        DateTime createdAt
        DateTime updatedAt
    }
    Career {
        String id
        String name
    }
    Skill {
        String id
        String name
    }
    Corporate {
        String id
        String description
        String imageUrl
        String name
        String site
    }
    TrackActivities {
        Int code
        Int courses
        Int lives
        Int project
        String trackId
    }
    Subtitle {
        String id
        String file
        String name
        String contentId
    }
    ModuleCourse {
        String moduleId
        String courseId
        Int order
    }
    UserTrack {
        String userId
        String trackId
        Boolean isStarted
        Boolean isCompleted
        Int totalCompleted
        DateTime completedAt
        Boolean isBookmarked
        DateTime bookmarkedAt
        Int rating
        Boolean liked
        String comment
        DateTime createdAt
        DateTime updatedAt
    }
    UserModule {
        String userId
        String moduleId
        Boolean isCompleted
        Int totalCoursesCompleted
        DateTime completedAt
    }
    UserCourse {
        String userId
        String courseId
        Boolean isStarted
        Boolean isCompleted
        Int totalLessonsCompleted
        DateTime completedAt
        Int rating
        Boolean liked
        String comment
        DateTime createdAt
        DateTime updatedAt
    }
    UserLesson {
        String userId
        String lessonId
        Boolean isCompleted
        Int totalContentsCompleted
        DateTime completedAt
    }
    UserContent {
        String userId
        String contentId
        Boolean isCompleted
        DateTime completedAt
        Boolean liked
        DateTime createdAt
        DateTime updatedAt
    }

    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ UserTrack : has
    User ||--o{ UserCourse : has
    User ||--o{ UserContent : has
    User ||--o{ UserModule : has
    User ||--o{ UserLesson : has
    Track ||--o{ Module : includes
    Track ||--o{ UserTrack : has
    Track ||--o{ TrackActivities : includes
    Track ||--o{ Career : includes
    Track ||--o{ Skill : includes
    Corporate ||--o{ Track : owns
    Module ||--o{ ModuleCourse : contains
    Course ||--o{ Lesson : includes
    Course ||--o{ UserCourse : includes
    Lesson ||--o{ Content : includes
    Lesson ||--o{ UserLesson : includes
    Content ||--o{ Subtitle : contains
    Content ||--o{ UserContent : includes
    Career ||--o{ Track : includes
    Skill ||--o{ Track : includes
    ModuleCourse ||--o{ Course : includes
    ModuleCourse ||--o{ Module : includes

```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
