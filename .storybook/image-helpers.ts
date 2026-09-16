/*  QGDS STORYBOOK IMAGE HELPER 
    Provides a set of example images and helper functions for Storybook stories.
    
    example: 
    import { imageHelper } from '.storybook/image-helpers';

    imageHelper.getByID(1) // retrieves the first example image
    imageHelper.getByName("vet") // retrieves the image with the key "vet"
*/

// 1. Import images directly so the bundler includes them in the build output
const imagePath = (filename: string) => `/assets/img/${filename}`;

const vet = imagePath("example-01-vet.jpg");
const vet2x = imagePath("example-01-vet-2x.jpg");
const workingPhoneTablet = imagePath("example-02-working-phone-tablet.jpg");
const healthWorker = imagePath("example-03-health-worker.jpg");
const diverCoral = imagePath("example-04-diver-coral.jpg");
const secludedBeach = imagePath("example-05-secluded-beach.jpg");
const beachWavesSunset = imagePath("example-06-beach-waves-sunset.jpg");
const coupleBeach = imagePath("example-07-couple-beach.jpg");
const coupleGardenTablet = imagePath("example-08-couple-garden-tablet.jpg");
const adultWithChildren = imagePath("example-09-adult-with-children.jpg");
const decorative = imagePath("example-10-decorative.jpg");

export const exampleImages = {
  vet,
  "vet-2x": vet2x,
  "working-phone-tablet": workingPhoneTablet,
  "health-worker": healthWorker,
  "diver-coral": diverCoral,
  "secluded-beach": secludedBeach,
  "beach-waves-sunset": beachWavesSunset,
  "couple-beach": coupleBeach,
  "couple-garden-tablet": coupleGardenTablet,
  "adult-with-children": adultWithChildren,
  decorative,
} as const;

export type ExampleImageName = keyof typeof exampleImages;
export type ExampleImageSrc = (typeof exampleImages)[ExampleImageName];

export const imageHelper = {
  src: exampleImages,

  getByID(id: number | string): string {
    const index = typeof id === "string" ? parseInt(id, 10) - 1 : id - 1;
    const values = Object.values(exampleImages);
    return values[index] ?? "";
  },

  getByName(name: ExampleImageName): ExampleImageSrc {
    return exampleImages[name];
  },
} as const;
