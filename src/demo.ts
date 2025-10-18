import { getConfusableDistance } from "@yuckabug/stringpea";
import { CONFUSABLE_FORM_ID, DISTANCE_VALUE_ID, EXPLANATION_ID, RESULT_DIV_ID } from "./constants";

const form = document.getElementById(CONFUSABLE_FORM_ID) as HTMLFormElement;
const resultDiv = document.getElementById(RESULT_DIV_ID) as HTMLDivElement;
const distanceValue = document.getElementById(DISTANCE_VALUE_ID) as HTMLSpanElement;
const explanation = document.getElementById(EXPLANATION_ID) as HTMLParagraphElement;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const string1 = (document.getElementById("string1") as HTMLInputElement).value;
  const string2 = (document.getElementById("string2") as HTMLInputElement).value;

  try {
    const distance = getConfusableDistance(string1, string2);

    distanceValue.textContent = distance.toString();

    if (distance === 0) {
      explanation.textContent =
        "These strings are confusably identical! After normalizing confusable characters (like 0→O, 1→l), they are the same.";
    } else if (distance === 1) {
      explanation.textContent = "These strings are very similar - only 1 character edit away after normalization.";
    } else {
      explanation.textContent = `These strings require ${distance} character edits to match after normalization.`;
    }

    resultDiv.classList.add("show");
  } catch (error) {
    distanceValue.textContent = "Error";
    explanation.textContent = `An error occurred: ${(error as Error).message}`;
    resultDiv.classList.add("show");
  }
});
