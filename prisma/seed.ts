import type {
  Career,
  Content,
  Corporate,
  Course,
  Lesson,
  Module,
  Prisma,
  Skill,
  Subtitle,
  Track,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import chalk from "chalk";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const prisma = new PrismaClient();

// Get the __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory where JSON files are stored
const tracksDirPath = path.join(__dirname, "../../dio-data-scraper/data"); // Adjust the path as needed
const coursesDirPath = path.join(tracksDirPath, "courses");

// -------------- Utility functions --------------

function toDate(timestamp: number, inSeconds: boolean = true): Date {
  return new Date(inSeconds ? timestamp * 1000 : timestamp);
}

function getJSONFiles(folderPath: string) {
  const allItems = fs.readdirSync(folderPath);

  return allItems
    .map((item: string) => path.join(folderPath, item)) // Get full path
    .filter(
      (filePath: string) =>
        fs.statSync(filePath).isFile() && filePath.endsWith(".json"),
    ); // filter json files
}

function readJSONFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// -------------- DB actions --------------

async function updateCorporates(corporates: Corporate[]) {
  for (const corporate of corporates) {
    const corporateExists = await prisma.corporate.findUnique({
      where: { id: corporate.id },
    });

    if (corporateExists) {
      console.log(`Existing corporate ${corporate.name}`);
      continue;
    }

    await prisma.corporate.create({
      data: corporate,
    });

    console.log(`Added corporate ${corporate.name}`);
  }
}

async function updateSkills(skills: Skill[]) {
  for (const skill of skills) {
    const skillExists = await prisma.skill.findUnique({
      where: { id: skill.id },
    });

    if (skillExists) {
      console.log(`Existing skill ${skill.name}`);
      continue;
    }

    await prisma.skill.create({
      data: skill,
    });

    console.log(`Added skill ${skill.name}`);
  }
}

async function updateCareers(careers: Career[]) {
  for (const career of careers) {
    const careerExists = await prisma.career.findUnique({
      where: { id: career.id },
    });

    if (careerExists) {
      console.log(`Existing career ${career.name}`);
      continue;
    }

    await prisma.career.create({
      data: career,
    });

    console.log(`Added career ${career.name}`);
  }
}

async function updateSubtitles(subtitles: Subtitle[]) {
  for (const subtitle of subtitles) {
    const subtitleExists = await prisma.subtitle.findUnique({
      where: { id: subtitle.id },
    });

    if (subtitleExists) {
      console.log(`Existing subtitle ${subtitle.name}`);
      continue;
    }

    await prisma.subtitle.create({
      data: {
        id: subtitle.id,
        file: subtitle.file,
        name: subtitle.name,
        contentId: subtitle.contentId,
      },
    });
    console.log(`Added subtitle ${subtitle.name}`);
  }
}

async function updateContents(contents: Content[]) {
  const amount = contents.length;
  let totalUpdated = 0;

  for (const content of contents) {
    const contentExists = await prisma.content.findUnique({
      where: { id: content.id },
    });
    if (contentExists) {
      console.log(chalk.gray(`Existing content ${content.name}`));
      const res = await prisma.content.update({
        where: { id: content.id },
        data: {
          order: content.order,
        },
      });
      totalUpdated++;
      const prefix = `${totalUpdated}/${amount}`;
      if (res) {
        console.log(chalk.green(`${prefix} Updated content ${content.name}`));
      } else {
        console.log(
          chalk.red(`${prefix} Failed updating content ${content.name}`),
        );
      }
      continue;
    }
    const res = await prisma.content.create({
      data: {
        id: content.id,
        slug: content.slug,
        content: content.content as Prisma.InputJsonValue,
        order: content.order,
        duration: content.duration,
        name: content.name,
        type: content.type,
        youtubeCode: content.youtubeCode,
        lessonId: content.lessonId,
        // subtitles: {
        //   connect: content.subtitles.map((x: Subtitle) => ({
        //     id: x.id,
        //   })),
        // },
      },
    });
    if (res) {
      console.log(chalk.green(`Added content ${content.name}`));
    } else {
      console.log(chalk.red(`Failed adding content ${content.name}`));
    }
  }
}

async function updateLessons(lessons: any[]) {
  for (const lesson of lessons) {
    const lessonExists = await prisma.lesson.findUnique({
      where: { id: lesson.id },
    });

    if (lessonExists) {
      console.log(`Existing lesson ${lesson.name}`);
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          contents: {
            connect: lesson.contents.map((x: Content) => ({ id: x.id })),
          },
        },
      });
      continue;
    }

    await prisma.lesson.create({
      data: {
        id: lesson.id,
        course: lesson.course,
        description: lesson.description,
        largeCover: lesson.largeCover,
        largeCover_disabled: lesson.largeCover_disabled,
        name: lesson.name,
        order: lesson.order,
        workloadHours: lesson.workload,
        contents: {
          connect: lesson.contents.map((x: Content) => ({ id: x.id })),
        },
      },
    });
    console.log(`Added lesson ${lesson.name}`);
  }
}

async function updateCourses(courses: any[]) {
  for (const course of courses) {
    const courseExists = await prisma.course.findUnique({
      where: { id: course.id },
    });

    if (courseExists) {
      console.log(`Existing course ${course.name}`);
      continue;
    }

    await prisma.course.create({
      data: {
        id: course.id,
        slug: course.slug,
        badge: course.badge,
        description: course.description,
        extraInformation: course.extraInformation,
        lessons: { connect: course.lessons.map((x: Lesson) => ({ id: x.id })) },
        level: course.level,
        name: course.name,
        type: course.type,
        workloadHours: course.workload,
      },
    });
    console.log(`Added course ${course.name}`);
  }
}

async function updateTracks(tracks: any[]) {
  for (const track of tracks) {
    const trackExists = await prisma.track.findUnique({
      where: { id: track.id },
    });

    if (trackExists) {
      console.log(`Existing track ${track.name}`);
      continue;
    }

    await prisma.track.create({
      data: {
        id: track.id,
        slug: track.slug,
        badge: track.badge,
        careers: {
          connect: track.careers.map((x: Career) => ({ id: x.id })),
        },
        color: track.color,
        corporate: {
          connect: {
            id: track.corporate.id,
          },
        },
        created: toDate(track.created),
        description: track.description,
        level: track.level,
        modules: { connect: track.modules.map((x: Module) => ({ id: x.id })) },
        name: track.name,
        nameAscii: track.nameAscii,
        banner: track.banner,
        sectionType: track.sectionType,
        skills: { connect: track.skills.map((x: Skill) => ({ id: x.id })) },
        workloadHours: track.workload,
      },
    });
    console.log(`Added track ${track.name}`);
  }
}

async function updateModules(modules: any[]) {
  let createdCount = 0;
  let resolvedPromises = 0;
  const amount = modules.length;

  const updatePromises = modules.map(async (_module) => {
    const moduleExists = await prisma.module.findUnique({
      where: { id: _module.id },
    });

    await prisma.module.upsert({
      where: { id: _module.id },
      update: {
        name: _module.name,
        courses: {
          upsert: _module.courses.map((courseId: string, index: number) => ({
            where: {
              moduleId_courseId: {
                moduleId: _module.id,
                courseId: courseId,
              },
            },
            update: {
              order: index + 1,
            },
            create: {
              courseId: courseId,
              order: index + 1,
            },
          })),
        },
      },
      create: {
        id: _module.id,
        name: _module.name,
        courses: {
          create: _module.courses.map((courseId: string, index: number) => ({
            courseId: courseId,
            order: index + 1,
          })),
        },
      },
    });

    resolvedPromises++;

    const prefix = `${resolvedPromises}/${amount}`;
    if (!moduleExists) {
      createdCount++;
      console.log(chalk.green(`${prefix} Created module: ${_module.name}`));
    } else {
      console.log(chalk.gray(`${prefix} Module exists: ${_module.name}`));
    }
  });

  await Promise.all(updatePromises);

  console.log(`Total modules created: ${createdCount}`);
}

async function readCourseJSONFiles() {
  const courseFiles = getJSONFiles(coursesDirPath);

  const courses: Course[] = [];
  const subtitles: Subtitle[] = [];
  const contents: Content[] = [];
  const lessons: Lesson[] = [];

  for (const filePath of courseFiles) {
    // Read and parse the JSON file
    const course = readJSONFile(filePath);

    if (!courses.some((x) => x.id === course.id)) {
      courses.push(course);
    }

    for (const lesson of course.lessons) {
      if (!lessons.some((x) => x.id === lesson.id)) {
        lessons.push(lesson);
      }

      for (const i in lesson.contents) {
        const content = lesson.contents[i];
        content.lessonId = lesson.id;
        content.order = Number(i) + 1;
        if (!contents.some((x) => x.id === content.id)) {
          contents.push(content);
        }

        for (const subtitle of content.subtitles) {
          subtitle.contentId = content.id;
          if (!subtitles.some((x) => x.id === subtitle.id)) {
            subtitles.push(subtitle);
          }
        }
      }
    }
  }

  // await updateLessons(lessons);
  // await updateCourses(courses);
  await updateContents(contents);
  // await updateSubtitles(subtitles);
}

async function readTrackJSONFiles() {
  const trackFiles = getJSONFiles(tracksDirPath);

  const modules: Module[] = [];
  const tracks: Track[] = [];
  const careers: Career[] = [];
  const corporates: Corporate[] = [];
  const skills: Skill[] = [];

  for (const filePath of trackFiles) {
    const track = readJSONFile(filePath);

    if (!tracks.some((x) => x.id === track.id)) {
      tracks.push(track);
    }

    for (const _module of track.modules) {
      _module.trackId = track.id;
      if (!modules.some((x) => x.id === _module.id)) {
        modules.push(_module);
      }
    }

    for (const career of track.careers) {
      if (!careers.some((x) => x.id === career.id)) {
        careers.push(career);
      }
    }

    if (!corporates.some((x) => x.id === track.corporate.id)) {
      corporates.push(track.corporate);
    }

    for (const skill of track.skills) {
      if (!skills.some((x) => x.id === skill.id)) {
        skills.push(skill);
      }
    }
  }

  console.table({
    trackFiles: trackFiles.length,
    modules: modules.length,
    tracks: tracks.length,
    careers: careers.length,
    corporates: corporates.length,
    skills: skills.length,
  });

  // await updatetrackActivities(trackActivities);
  await updateModules(modules);
  // await updateTracks(tracks);
  // updateCorporates(corporates);
  // updateSkills(skills);
  // updateCareers(careers);
}

async function main() {
  // await readTrackJSONFiles();
  await readCourseJSONFiles();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
