export interface ISSUES {
  _id: string;
  title: string;
  description: string;
  issueIllustrationUrl: string;
}
import { UseFormRegister, FieldValues } from "react-hook-form";

const ProductTypeFields = ({
  type,
  register,
}: {
  type: string;
  register: UseFormRegister<FieldValues>;
}) => {
  switch (type) {
    case "COMIC":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Pages</label>
            <input
              type="number"
              {...register("details.pages", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Author</label>
            <input
              {...register("details.author", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Publisher</label>
            <input
              {...register("details.publisher")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Series</label>
            <input
              {...register("details.series")}
              className="p-2 w-full rounded border"
            />
          </div>
        </div>
      );

    case "AUDIO_COMIC":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input
              type="number"
              {...register("details.duration", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Narrator</label>
            <input
              {...register("details.narrator", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Sample URL</label>
            <input
              {...register("details.sampleUrl")}
              className="p-2 w-full rounded border"
            />
          </div>
        </div>
      );
    case "PODCAST":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Episode Number</label>
            <input
              type="number"
              {...register("details.episodeNumber", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Host</label>
            <input
              {...register("details.host")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Language</label>
            <input
              {...register("details.language")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Release Date</label>
            <input
              type="date"
              {...register("details.releaseDate")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input
              type="number"
              {...register("details.duration")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Sample URL</label>
            <input
              {...register("details.sampleUrl")}
              className="p-2 w-full rounded border"
            />
          </div>
        </div>
      );
    case "WORKSHOP":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Instructor</label>
            <input
              {...register("details.instructor", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <input
              {...register("details.location")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Schedule</label>
            <input
              type="datetime-local"
              {...register("details.schedule", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Duration (hours)</label>
            <input
              type="number"
              {...register("details.duration", { required: true })}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Capacity</label>
            <input
              type="number"
              {...register("details.capacity")}
              className="p-2 w-full rounded border"
            />
          </div>
          <div>
            <label className="block mb-1">Materials (comma-separated)</label>
            <input
              {...register("details.materials")}
              placeholder="Item 1, Item 2, Item 3"
              className="p-2 w-full rounded border"
            />
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Workshop Offerings</label>
            {/* Assuming you have a separate component for handling array fields */}
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 gap-4 p-4 rounded border"
                >
                  <div>
                    <label className="block mb-1">Title</label>
                    <input
                      {...register(`details.workshopOffering.${index}.title`)}
                      className="p-2 w-full rounded border"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Description</label>
                    <textarea
                      {...register(
                        `details.workshopOffering.${index}.description`
                      )}
                      className="p-2 w-full rounded border"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Image URL</label>
                    <input
                      {...register(
                        `details.workshopOffering.${index}.imageUrl`
                      )}
                      className="p-2 w-full rounded border"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Accent Color</label>
                    <input
                      type="color"
                      {...register(
                        `details.workshopOffering.${index}.accentColor`
                      )}
                      className="p-2 w-full rounded border"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <label className="block mb-1">Addressed Issues</label>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="p-4 rounded border">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block mb-1">Title</label>
                      <input
                        {...register(`details.addressedIssues.${index}.title`)}
                        className="p-2 w-full rounded border"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Description</label>
                      <textarea
                        {...register(
                          `details.addressedIssues.${index}.description`
                        )}
                        className="p-2 w-full rounded border"
                        rows={3}
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
                        className="p-2 w-full rounded border"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    // In the switch statement, add or update the ASSESSMENT case:

    case "ASSESSMENT":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block mb-1">Questions</label>
            <div className="space-y-6">
              {[0, 1, 2].map((index) => (
                <div key={index} className="p-4 bg-gray-50 rounded border">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Question Text</label>
                      <textarea
                        {...register(`details.questions.${index}.questionText`)}
                        className="p-2 w-full rounded border"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block mb-1">
                        Options (one per line)
                      </label>
                      <textarea
                        {...register(`details.questions.${index}.options`)}
                        className="p-2 w-full rounded border"
                        rows={4}
                        placeholder="Option 1&#10;Option 2&#10;Option 3&#10;Option 4"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Correct Answer</label>
                      <input
                        {...register(
                          `details.questions.${index}.correctAnswer`
                        )}
                        className="p-2 w-full rounded border"
                      />
                    </div>

                    <div>
                      <label className="block mb-1">Explanation</label>
                      <textarea
                        {...register(`details.questions.${index}.explanation`)}
                        className="p-2 w-full rounded border"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-1">Passing Score</label>
            <input
              type="number"
              {...register("details.passingScore")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input
              type="number"
              {...register("details.duration")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Difficulty Level</label>
            <select
              {...register("details.difficulty")}
              className="p-2 w-full rounded border"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">Total Questions</label>
            <input
              type="number"
              {...register("details.totalQuestions")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Created By</label>
            <input
              {...register("details.createdBy")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Created Date</label>
            <input
              type="date"
              {...register("details.createdDate")}
              className="p-2 w-full rounded border"
            />
          </div>
        </div>
      );

    // Add this case in the switch statement

    case "MERCHANDISE":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block mb-1">Sizes (one per line)</label>
            <textarea
              {...register("details.sizes")}
              className="p-2 w-full rounded border"
              rows={4}
              placeholder="S&#10;M&#10;L&#10;XL"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Colors (one per line)</label>
            <textarea
              {...register("details.colors")}
              className="p-2 w-full rounded border"
              rows={4}
              placeholder="Red&#10;Blue&#10;Green"
            />
          </div>

          <div>
            <label className="block mb-1">Material</label>
            <input
              {...register("details.material")}
              className="p-2 w-full rounded border"
              placeholder="Cotton, Polyester, etc."
            />
          </div>

          <div>
            <label className="block mb-1">Brand</label>
            <input
              {...register("details.brand")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Stock Quantity</label>
            <input
              type="number"
              {...register("details.stockQuantity")}
              className="p-2 w-full rounded border"
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              {...register("details.price")}
              className="p-2 w-full rounded border"
              min="0"
              step="0.01"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Description</label>
            <textarea
              {...register("details.description")}
              className="p-2 w-full rounded border"
              rows={3}
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Care Instructions</label>
            <textarea
              {...register("details.careInstructions")}
              className="p-2 w-full rounded border"
              rows={3}
              placeholder="Washing instructions, maintenance tips, etc."
            />
          </div>

          <div>
            <label className="block mb-1">Created By</label>
            <input
              {...register("details.createdBy")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div>
            <label className="block mb-1">Created Date</label>
            <input
              type="date"
              {...register("details.createdDate")}
              className="p-2 w-full rounded border"
            />
          </div>
        </div>
      );

    case "SELF_HELP_CARD":
      return (
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block mb-1">Card Type</label>
            <select
              {...register("details.cardType")}
              className="p-2 w-full rounded border"
            >
              <option value="conversation starter cards">
                Conversation Starter Cards
              </option>
              <option value="story re-teller cards">
                Story Re-teller Cards
              </option>
              <option value="silent stories">Silent Stories</option>
              <option value="conversation story cards">
                Conversation Story Cards
              </option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Accent Color</label>
            <input
              type="color"
              {...register("details.accentColor")}
              className="p-2 w-full rounded border"
            />
          </div>

          <div className="col-span-2">
            <label className="block mb-1">Addressed Issues</label>
            <div className="space-y-4">
              {[0, 1, 2].map((index) => (
                <div key={index} className="p-4 rounded border">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Title</label>
                      <input
                        {...register(`details.addressedIssue.${index}.title`)}
                        className="p-2 w-full rounded border"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Description</label>
                      <textarea
                        {...register(
                          `details.addressedIssue.${index}.description`
                        )}
                        className="p-2 w-full rounded border"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block mb-1">
                        Issue Illustration URL
                      </label>
                      <input
                        type="url"
                        {...register(
                          `details.addressedIssue.${index}.issueIllustrationUrl`
                        )}
                        className="p-2 w-full rounded border"
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
                <div key={index} className="p-4 rounded border">
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Label</label>
                      <input
                        {...register(
                          `details.productDescription.${index}.label`
                        )}
                        className="p-2 w-full rounded border"
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Description List</label>
                      <div className="space-y-2">
                        {[0, 1, 2].map((descIndex) => (
                          <div key={descIndex}>
                            <input
                              {...register(
                                `details.productDescription.${index}.descriptionList.${descIndex}.description`
                              )}
                              className="p-2 w-full rounded border"
                              placeholder={`Description ${descIndex + 1}`}
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
    // Add similar sections for other product types
    default:
      return null;
  }
};

export default ProductTypeFields;
