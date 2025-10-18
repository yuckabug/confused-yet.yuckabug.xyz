/// <reference lib="dom" />

import { beforeEach, describe, expect, test } from "bun:test";
import { getConfusableDistance } from "@yuckabug/stringpea";
import type {
  HTMLDivElement,
  HTMLFormElement,
  HTMLInputElement,
  HTMLParagraphElement,
  HTMLSpanElement,
} from "happy-dom";
import { Window } from "happy-dom";
import { CONFUSABLE_FORM_ID, DISTANCE_VALUE_ID, EXPLANATION_ID, RESULT_DIV_ID } from "../src/constants";

/**
 * The string1 input ID.
 */
export const STRING1_INPUT_ID = "string1";
/**
 * The string2 input ID.
 */
export const STRING2_INPUT_ID = "string2";

describe("Demo form functionality", () => {
  let window: Window;
  let document: Window["document"];

  let form: HTMLFormElement;
  let string1Input: HTMLInputElement;
  let string2Input: HTMLInputElement;
  let resultDiv: HTMLDivElement;
  let distanceValue: HTMLSpanElement;
  let explanation: HTMLParagraphElement;

  beforeEach(() => {
    // Set up a virtual DOM environment
    window = new Window();
    document = window.document;

    // Create the HTML structure that demo.ts expects
    document.body.innerHTML = `
      <form id="${CONFUSABLE_FORM_ID}">
        <input type="text" id="${STRING1_INPUT_ID}" />
        <input type="text" id="${STRING2_INPUT_ID}" />
        <button type="submit">Submit</button>
      </form>
      <div id="${RESULT_DIV_ID}">
        <span class="distance-value" id="${DISTANCE_VALUE_ID}"></span>
        <p id="${EXPLANATION_ID}"></p>
      </div>
    `;

    // Get the elements
    form = document.getElementById(CONFUSABLE_FORM_ID) as HTMLFormElement;
    string1Input = document.getElementById(STRING1_INPUT_ID) as HTMLInputElement;
    string2Input = document.getElementById(STRING2_INPUT_ID) as HTMLInputElement;
    resultDiv = document.getElementById(RESULT_DIV_ID) as HTMLDivElement;
    distanceValue = document.getElementById(DISTANCE_VALUE_ID) as HTMLSpanElement;
    explanation = document.getElementById(EXPLANATION_ID) as HTMLParagraphElement;
  });

  test("form submission calculates distance correctly", () => {
    // Set up the event handler (simulating what demo.ts does)
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const str1 = string1Input.value;
      const str2 = string2Input.value;

      try {
        const distance = getConfusableDistance(str1, str2);
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

    // Simulate user input
    string1Input.value = "HELLO";
    string2Input.value = "HELL0";

    // Trigger form submission
    form.dispatchEvent(new window.Event("submit"));

    // Verify the results
    expect(distanceValue.textContent).toBe("0");
    expect(explanation.textContent).toContain("confusably identical");
    expect(resultDiv.classList.contains("show")).toBe(true);
  });

  test("form handles different distances correctly", () => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const distance = getConfusableDistance(string1Input.value, string2Input.value);
      distanceValue.textContent = distance.toString();

      if (distance === 0) {
        explanation.textContent =
          "These strings are confusably identical! After normalizing confusable characters (like 0→O, 1→l), they are the same.";
      } else if (distance === 1) {
        explanation.textContent = "These strings are very similar - only 1 character edit away after normalization.";
      } else {
        explanation.textContent = `These strings require ${distance} character edits to match after normalization.`;
      }
    });

    // Test distance = 1
    string1Input.value = "admin";
    string2Input.value = "adm1n";
    form.dispatchEvent(new window.Event("submit"));

    expect(distanceValue.textContent).toBe("1");
    expect(explanation.textContent).toContain("1 character edit away");
  });

  test("form handles larger distances correctly", () => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const distance = getConfusableDistance(string1Input.value, string2Input.value);
      distanceValue.textContent = distance.toString();

      if (distance === 0) {
        explanation.textContent =
          "These strings are confusably identical! After normalizing confusable characters (like 0→O, 1→l), they are the same.";
      } else if (distance === 1) {
        explanation.textContent = "These strings are very similar - only 1 character edit away after normalization.";
      } else {
        explanation.textContent = `These strings require ${distance} character edits to match after normalization.`;
      }
    });

    // Test distance > 1
    string1Input.value = "hello";
    string2Input.value = "world";
    form.dispatchEvent(new window.Event("submit"));

    const distance = parseInt(distanceValue.textContent || "0", 10);
    expect(distance).toBeGreaterThan(1);
    expect(explanation.textContent).toContain(`${distance} character edits`);
  });
});
