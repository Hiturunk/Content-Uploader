/// <reference types="@testing-library/cypress" />

describe("smoke tests", () => {
  it("Should allow a user with proper images and metadata to run through the app.", () => {
    cy.session("0", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/perfect-image-single.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });
  it("Should allow a user with 3D Models and good metadata to run through the app.", () => {
    cy.session("1", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/perfect-3d-models.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });
  it("Should allow a user with a song and good metadata to run through the app.", () => {
    cy.session("2", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/perfect-song-single.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });

  it("Should allow a user to do a single-sided upload of just an image", () => {
    cy.session("3", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/one-sided-single-image.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });

  it("Should allow a user to do a single-sided upload of just metadata", () => {
    cy.session("4", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/one-sided-single-metadata.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });
  it("Should allow a user to do an upload of duplicate images, and warn them.", () => {
    cy.session("5", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/imperfect-duplicate-images.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });
  it("Should allow a user to do an upload of malformed json and warn them/fix it.", () => {
    cy.session("6", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/broken-malformed-json.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });
  it("Should allow a user to do an upload of a zip with imperfect hierarchy and warn them/fix it.", () => {
    cy.session("7", () => {
      cy.visit("/upload");
      cy.wait(1000);

      cy.get("input#File").selectFile(
        "cypress/fixtures/imperfect-hierarchy.zip",
        {
          force: true,
        }
      );
      cy.findByRole("button", { name: "CONTINUE →" }).click();

      cy.wait(5000);
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(5000);
      cy.contains("SELECT").click();
      cy.wait(5000);
      cy.get('input[name="apiKey"]')
        .type(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        )
        .should(
          "have.value",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGY3M0MxNDhlZUNERUNCQ0YwMzkyYTIyNzY2NDk2NkY2OTdiN0E4MDMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4ODM1NDE0MTI1NiwibmFtZSI6InRlc3QifQ.UREq0BWVtzcBsj_YBatEG7UujXXvCvozPIeeWHyzeF0"
        );
      cy.findByRole("button", { name: "CONTINUE →" }).click();
      cy.wait(10000);
      cy.contains("ipfs://")
        .invoke("text")
        .should("match", /ipfs:\/\/\S+/);
    });
  });
});
