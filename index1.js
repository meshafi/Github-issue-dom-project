
class GitHubApiHandler {
  static username = "meshafi";
  static repoName = "Art-Gallery";
  static gitApi = `https://api.github.com/repos/${GitHubApiHandler.username}/${GitHubApiHandler.repoName}/issues`;
  static token = "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";

  async methodPatch(issueNumber, updatedIssueTitle, updatedIssueBody) {
    try {
      await fetch(`${GitHubApiHandler.gitApi}/${issueNumber}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${GitHubApiHandler.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedIssueTitle,
          body: updatedIssueBody,
        }),
      });
    } catch (error) {
      console.error("Error in Patch medhod");
    }
  }
  async methodPost(issueTitle, issueBody) {
    try {
      await fetch(GitHubApiHandler.gitApi, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GitHubApiHandler.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
        }),
      });
    } catch (error) {
      console.error("Error in POST method");
    }
  }
  async fetchApi(issueNumber) {
    try {
      const issueDetailsResponse = await fetch(
        `${GitHubApiHandler.gitApi}/${issueNumber}`,
        {
          headers: {
            Authorization: `Bearer ${GitHubApiHandler.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const issueDetails = await issueDetailsResponse.json();
      return issueDetails;
    } catch (error) {
      console.error("Error in fetching Api");
    }
  }

  async closeIssueRequest(issueNumber) {
    try {
      await fetch(`${GitHubApiHandler.gitApi}/${issueNumber}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${GitHubApiHandler.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          state: "closed",
        }),
      });
    } catch (error) {
      console.error("Error in Closing Issue");
    }
  }
}

/* function to show issue */
async function showIssues() {
  try{
  const res = await fetch(GitHubApiHandler.gitApi);
  const issues = await res.json();
  const issuesList = document.getElementById("issuesList");
  issuesList.innerHTML = "";
  for (let issue of issues) {
    const issueElement = document.createElement("div");
    issueElement.id=`issue-${issue.number}`;
    issueElement.innerHTML = `<strong>Title- </strong>${issue.title}<br><strong>Body- </strong>${issue.body}<br><button onclick="toggleUpdateIssue(${issue.number})">Update</button><button onclick="closeIssue(${issue.number})">Close</button>`;
    issuesList.append(issueElement);
  }
 }
 catch(error){
  console.log('error in showing issues')
 }
}

/* function to create issue */
async function createIssue() {
  try {
    const issueTitle = document.getElementById("newIssueTitle").value;
    const issueBody = document.getElementById("newIssueBody").value;

    // Input validation
    if (!issueTitle.trim() || !issueBody.trim()) {
      toastr.error('Issue title and body cannot be empty', 'Error');
      return;
    }

    const gitHubHandler = new GitHubApiHandler();
    await gitHubHandler.methodPost(issueTitle, issueBody);
    toastr.success('Issue created successfully');
    document.getElementById("newIssueTitle").value = "";
    document.getElementById("newIssueBody").value = "";
  } catch (error) {
    console.log("Error in creating issue", error);
    toastr.error('Failed to create the issue', 'Error');
  }
  showIssues();
}

async function toggleUpdateIssue(issueNumber) {
  try {
    const updateIssueDiv = document.getElementById("update-issue");
    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";
    updateIssueDiv.style.display = "flex";
    updateIssueDiv.dataset.issueNumber = issueNumber;

    const gitHubHandler = new GitHubApiHandler();
    const issueDetails = await gitHubHandler.fetchApi(issueNumber);
    document.getElementById("updateIssueTitle").value = issueDetails.title;
    document.getElementById("updateIssueBody").value = issueDetails.body;
  } catch (error) {
    console.error("Error in Updating issue");
  }
}

/* function to cancel update */
function cancelUpdate() {
  const updateIssueDiv = document.getElementById("update-issue");
  updateIssueDiv.style.display = "none";

  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";
}

/* function to update Issue */
async function updateIssue() {
  try {
    const issueNumber =
    document.getElementById("update-issue").dataset.issueNumber;
    const updatedIssueTitle = document.getElementById("updateIssueTitle").value;
    const updatedIssueBody = document.getElementById("updateIssueBody").value;
    const gitHubHandler = new GitHubApiHandler();
    await gitHubHandler.methodPatch(
      issueNumber,
      updatedIssueTitle,
      updatedIssueBody
    );
    toastr.success('Issue Updated Successfully');
    const updateIssueDiv = document.getElementById("update-issue");
    updateIssueDiv.style.display = "none";

    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    showIssues();
  } catch (error) {
    console.error("Error in updating issue");
  }
}

/* function to close Issue */
async function closeIssue(issueNumber) {
  try {
    const gitHubHandler = new GitHubApiHandler();
    const issueDiv=document.getElementById(`issue-${issueNumber}`);
    await gitHubHandler.closeIssueRequest(issueNumber);
    toastr.success('Issue closed successfully');
    showIssues();
  } catch (error) {
    console.error("Error in closing Issue",error);
  }
}

showIssues();
