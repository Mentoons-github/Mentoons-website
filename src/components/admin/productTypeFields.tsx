export interface ISSUES {
  _id: string;
  title: string;
  description: string;
  issueIllustrationUrl: string;
}
import { FieldValues, UseFormRegister } from "react-hook-form";

const ProductTypeFields = ({
  type,
  register,
}: {
  type: string;
  register: UseFormRegister<FieldValues>;
}) => {
  switch (type) {
    case "comic":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Pages</label>
            <input
              type="number"
              {...register("details.pages", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue={9}
            />
          </div>
          <div>
            <label className="block mb-1">Author</label>
            <input
              {...register("details.author", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons Creative Team"
            />
          </div>
          <div>
            <label className="block mb-1">Publisher</label>
            <input
              {...register("details.publisher")}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons"
            />
          </div>
          <div>
            <label className="block mb-1">Language</label>
            <input
              {...register("details.language")}
              className="w-full p-2 border rounded"
              defaultValue="en"
            />
          </div>
          <div>
            <label className="block mb-1">Sample URL</label>
            <input
              {...register("details.sampleUrl")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Release Date</label>
            <input
              type="date"
              {...register("details.releaseDate")}
              className="w-full p-2 border rounded"
              defaultValue="2024-01-15"
            />
          </div>
          <div>
            <label className="block mb-1">Series</label>
            <input
              {...register("details.series")}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      );

    case "audio comic":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Duration (mm:ss)</label>
            <input
              {...register("details.duration", { required: true })}
              className="w-full p-2 border rounded"
              placeholder="4:27"
              defaultValue="4:27"
            />
          </div>
          <div>
            <label className="block mb-1">Narrator</label>
            <input
              {...register("details.narrator", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons Team"
            />
          </div>
          <div>
            <label className="block mb-1">Language</label>
            <input
              {...register("details.language")}
              className="w-full p-2 border rounded"
              defaultValue="en"
            />
          </div>
          <div>
            <label className="block mb-1">Format</label>
            <input
              {...register("details.format")}
              className="w-full p-2 border rounded"
              defaultValue="mp4"
            />
          </div>
          <div>
            <label className="block mb-1">Sample Duration (mm:ss)</label>
            <input
              {...register("details.sampleDuration")}
              className="w-full p-2 border rounded"
              defaultValue="1:00"
            />
          </div>
          <div>
            <label className="block mb-1">Sample URL</label>
            <input
              {...register("details.sampleUrl")}
              className="w-full p-2 border rounded"
              defaultValue="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/AGES+13+-+19/CHOOSE_WISELY.mp4"
            />
          </div>
          <div>
            <label className="block mb-1">Release Date</label>
            <input
              type="date"
              {...register("details.releaseDate")}
              className="w-full p-2 border rounded"
              defaultValue="2024-01-20"
            />
          </div>
        </div>
      );
    case "podcast":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Category</label>
            <input
              {...register("details.category", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue="mobile addiction"
            />
          </div>
          <div>
            <label className="block mb-1">Episode Number</label>
            <input
              type="number"
              {...register("details.episodeNumber", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue={1}
            />
          </div>
          <div>
            <label className="block mb-1">Duration (mm:ss)</label>
            <input
              {...register("details.duration", { required: true })}
              className="w-full p-2 border rounded"
              placeholder="2:12"
              defaultValue="2:12"
            />
          </div>
          <div>
            <label className="block mb-1">Language</label>
            <input
              {...register("details.language")}
              className="w-full p-2 border rounded"
              defaultValue="en"
            />
          </div>
          <div>
            <label className="block mb-1">Host</label>
            <input
              {...register("details.host")}
              className="w-full p-2 border rounded"
              defaultValue="Haaris Rueben"
            />
          </div>
          <div>
            <label className="block mb-1">Sample URL</label>
            <input
              {...register("details.sampleUrl")}
              className="w-full p-2 border rounded"
              defaultValue="https://mentoons-comics.s3.ap-northeast-1.amazonaws.com/podcast/negative-impact-of-social-media.mp3"
            />
          </div>
          <div>
            <label className="block mb-1">Release Date</label>
            <input
              type="date"
              {...register("details.releaseDate")}
              className="w-full p-2 border rounded"
              defaultValue="2024-02-15"
            />
          </div>
        </div>
      );

    // In the switch statement, add or update the ASSESSMENT case:

    case "assessment":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Color</label>
            <input
              type="color"
              {...register("details.color")}
              className="w-full p-2 border rounded"
              defaultValue="#652D90"
            />
          </div>

          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input
              type="number"
              {...register("details.duration")}
              className="w-full p-2 border rounded"
              defaultValue={10}
            />
          </div>

          <div>
            <label className="block mb-1">Difficulty Level</label>
            <input
              {...register("details.difficulty")}
              className="w-full p-2 border rounded"
              defaultValue="College Students"
            />
          </div>

          <div>
            <label className="block mb-1">Credits</label>
            <input
              {...register("details.credits")}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons"
            />
          </div>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <label className="block">Question Gallery</label>
              <button
                type="button"
                onClick={() => {
                  const currentLength = document.querySelectorAll(
                    "[data-question-item]"
                  ).length;
                  const newIndex = currentLength;
                  register(`details.questionGallery.${newIndex}.imageUrl`);
                  register(`details.questionGallery.${newIndex}.options`);
                  register(`details.questionGallery.${newIndex}.correctAnswer`);
                }}
                className="px-4 py-2 text-white bg-blue-500 rounded"
              >
                Add Question
              </button>
            </div>
            <div className="space-y-6">
              {/* Dynamic question fields */}
              <div data-question-item className="p-4 border rounded bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block mb-1">Image URL</label>
                    <input
                      type="url"
                      {...register("details.questionGallery.0.imageUrl")}
                      className="w-full p-2 border rounded"
                    />
                  </div>

                  <div></div>
                  <label className="block mb-1">Options (one per line)</label>
                  <textarea
                    {...register("details.questionGallery.0.options")}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block mb-1">Correct Answer</label>
                  <input
                    {...register("details.questionGallery.0.correctAnswer")}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    const item = e.currentTarget.closest(
                      "[data-question-item]"
                    );
                    item?.remove();
                  }}
                  className="px-3 py-1 text-white bg-red-500 rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    case "mentoons card":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block mb-1">Card Type</label>
            <select
              {...register("details.cardType")}
              className="w-full p-2 border rounded"
              defaultValue="CONVERSATION_STARTER_CARDS"
            >
              <option value="CONVERSATION_STARTER_CARDS">
                Conversation Starter Cards
              </option>
              <option value="STORY_RETELLER_CARDS">
                Story Re-teller Cards
              </option>
              <option value="SILENT_STORIES">Silent Stories</option>
              <option value="CONVERSATION_STORY_CARDS">
                Conversation Story Cards
              </option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Accent Color</label>
            <input
              type="color"
              {...register("details.accentColor")}
              className="w-full p-2 border rounded"
              defaultValue="#F9A411"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Addressed Issues</label>
            <div className="space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="p-4 border rounded">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Title</label>
                      <input
                        {...register(`details.addressedIssues.${index}.title`)}
                        className="w-full p-2 border rounded"
                        defaultValue={
                          [
                            "Low Confidence",
                            "Aggressive Behavior",
                            "Lack of Communication",
                            "Disobiendence",
                          ][index]
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Description</label>
                      <textarea
                        {...register(
                          `details.addressedIssues.${index}.description`
                        )}
                        className="w-full p-2 border rounded"
                        rows={3}
                        defaultValue="Building self-confidence through daily activities"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Issue Illustration URL
                      </label>
                      <input
                        type="url"
                        {...register(
                          `details.addressedIssues.${index}.issueIllustrationUrl`
                        )}
                        className="w-full p-2 border rounded"
                        defaultValue={
                          [
                            "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/low-confidence.png",
                            "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/aggressive-behaviour.png",
                            "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/lack-of-communication.png",
                            "https://mentoons-products.s3.ap-northeast-1.amazonaws.com/Products/disobidience.png",
                          ][index]
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Product Description</label>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="p-4 border rounded">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Label</label>
                      <input
                        {...register(
                          `details.productDescription.${index}.label`
                        )}
                        className="w-full p-2 border rounded"
                        defaultValue={
                          [
                            "Conversation Starter Cards",
                            "How kids will benefit",
                            "How parent will benefits",
                          ][index]
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Description List</label>
                      <div className="space-y-2">
                        {[0, 1, 2, 3, 4].map((descIndex) => (
                          <div key={descIndex}>
                            <input
                              {...register(
                                `details.productDescription.${index}.descriptionList.${descIndex}.description`
                              )}
                              className="w-full p-2 border rounded"
                              defaultValue={
                                [
                                  [
                                    "Story telling format",
                                    "Developed by psychologist and educators",
                                    "Age appropriate content",
                                    "Beautifully illustrated",
                                    "Introduction to new vocabulary",
                                  ],
                                  [
                                    "Learn easily by oldest format of communication",
                                    "Supports emotional and social growth.",
                                    "Safe content for kids",
                                    "Makes learning visually engaging",
                                    "Expand language skills",
                                  ],
                                  [
                                    "Helps in genuine friendships",
                                    "Provides expert-backed guidance",
                                    "Simplifies age specific guidance",
                                    "Keeps kids interested and focused",
                                    "Boosts child's language development",
                                  ],
                                ][index][descIndex]
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    case "mentoons books":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Pages</label>
            <input
              type="number"
              {...register("details.pages", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue={100}
            />
          </div>
          <div>
            <label className="block mb-1">Author</label>
            <input
              {...register("details.author", { required: true })}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons Team"
            />
          </div>
          <div>
            <label className="block mb-1">Publisher</label>
            <input
              {...register("details.publisher")}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons"
            />
          </div>
          <div>
            <label className="block mb-1">Language</label>
            <input
              {...register("details.language")}
              className="w-full p-2 border rounded"
              defaultValue="en"
            />
          </div>
          <div>
            <label className="block mb-1">Book Type</label>
            <input
              {...register("details.bookType")}
              className="w-full p-2 border rounded"
              defaultValue="Coloring Book"
            />
          </div>
          <div>
            <label className="block mb-1">Series</label>
            <input
              {...register("details.series")}
              className="w-full p-2 border rounded"
              defaultValue="Mentoons Coloring Book"
            />
          </div>
          <div>
            <label className="block mb-1">ISBN</label>
            <input
              {...register("details.isbn")}
              className="w-full p-2 border rounded"
              defaultValue="978-3-16-148411-7"
            />
          </div>
          <div>
            <label className="block mb-1">Edition</label>
            <input
              {...register("details.edition")}
              className="w-full p-2 border rounded"
              defaultValue="First Edition"
            />
          </div>
          <div>
            <label className="block mb-1">Release Date</label>
            <input
              type="date"
              {...register("details.releaseDate")}
              className="w-full p-2 border rounded"
              defaultValue="2024-03-10"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Dimensions</label>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                {...register("details.dimensions.height")}
                className="w-full p-2 border rounded"
                placeholder="Height"
                defaultValue={11}
              />
              <input
                type="number"
                {...register("details.dimensions.width")}
                className="w-full p-2 border rounded"
                placeholder="Width"
                defaultValue={8.5}
              />
              <input
                type="number"
                {...register("details.dimensions.depth")}
                className="w-full p-2 border rounded"
                placeholder="Depth"
                defaultValue={0.3}
              />
            </div>
          </div>
        </div>
      );
    // Add similar sections for other product types
    default:
      return null;
  }
};

export default ProductTypeFields;
