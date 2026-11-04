# CodeQL fork pull request migration

This runbook prepares `BabylonJS/Documentation` to replace CodeQL default
setup with an advanced workflow that scans fork-origin pull requests without
executing repository scripts or exposing infrastructure credentials.

## Status

| Milestone | Status | Evidence |
| --- | --- | --- |
| Workflow prepared | **Prepared locally** | `.github/workflows/codeql.yml` |
| Fork PR successfully scanned | **Not verified** | Requires an authorized benign fork PR after activation |
| Merge gate verified | **Not configured or verified** | Requires separate proof of pending/missing-analysis blocking and qualifying-alert blocking |

Do not describe this preparation as active protection until both live
verification milestones are complete.

## Repository evidence captured on 2026-11-03

- The repository is public and the default branch is `master`:
  <https://github.com/BabylonJS/Documentation>.
- CodeQL default setup is configured for `actions`,
  `javascript`, `javascript-typescript`, and `typescript`, with the default
  query suite, remote threat model, weekly schedule, and standard runner:
  `GET /repos/BabylonJS/Documentation/code-scanning/default-setup`.
  The duplicate language aliases represent two effective analyses:
  `actions` and `javascript-typescript`.
- GitHub documents that default setup excludes pull requests from forks:
  <https://docs.github.com/en/code-security/concepts/code-scanning/setup-types>.
- The repository workflow at
  <https://github.com/BabylonJS/Documentation/blob/master/.github/workflows/codeql.yml>
  is currently `disabled_manually`. It used CodeQL Action v2, checkout v3,
  JavaScript only, and `autobuild`.
- Recent fork PRs, including
  <https://github.com/BabylonJS/Documentation/pull/1649> and
  <https://github.com/BabylonJS/Documentation/pull/1655>, have no CodeQL check
  on either their head or current merge revision. Exact pull-ref analysis
  queries for PRs 1649, 1655, 1656, and 1654 returned no analyses.
- `master` is the only protected branch. No maintained release branch was
  identified. Its required status check is `Documentation`; CodeQL is not
  required. Protection also requires one approving review and resolved
  conversations, disallows force pushes and deletion, and does not enforce
  signed commits or administrator inclusion:
  <https://github.com/BabylonJS/Documentation/settings/branches>.
- No repository or inherited ruleset was returned, and the repository has no
  merge queue. The GraphQL repository response returned `mergeQueue: null`.
- Repository Actions policy allows all actions. The default workflow token has
  write permissions and may approve pull request reviews, but this CodeQL job
  narrows its own token to `contents: read` and `security-events: write`.
- Outside-contributor workflow approval is required for first-time
  contributors. This policy does not gate workflow changes from returning
  contributors. Organization-level Actions policy and allowlist inspection
  was denied with HTTP 403 because the inspecting account lacks the
  organization Actions-policy permission and `admin:org` scope. Treat the
  organization policy as **unknown** until an organization owner verifies it.
- The repository has no `github-codeql-config-file` custom property and no
  CodeQL configuration or model-extension file other than the old workflow.
- GitHub's code-scanning merge protection does not apply to merge queue groups
  or Dependabot pull requests analyzed by default setup, and an alert is
  merge-blocking only when all reported locations exist in the PR diff:
  <https://docs.github.com/en/code-security/concepts/code-scanning/merge-protection>.

## Prepared workflow security properties

- Uses `pull_request`, never `pull_request_target`. GitHub checks out the normal
  pull request merge revision because checkout has no `ref` override.
- Scans pushes and pull requests for `master`, runs weekly, supports a manual
  first run, and includes `merge_group` for possible future queue execution.
- Scans the effective existing coverage: `javascript-typescript` and `actions`.
  Both use `build-mode: none`.
- Runs only GitHub-authored actions on a disposable `ubuntu-latest` runner.
  It does not install dependencies, invoke autobuild, run repository scripts,
  build, test, use downloaded project tooling, access internal networks, or
  use a self-hosted runner.
- The job has only `contents: read` and `security-events: write`. It requests no
  secrets, PAT, `id-token`, package write, or repository write permission.
  Fork result upload relies on GitHub's supported code-scanning behavior for
  `pull_request` workflows, not on broadening the repository token.
- Checkout uses `persist-credentials: false`.
- The `init` action receives trusted inline configuration. The `config` input
  takes precedence over `config-file`, so a PR-supplied default CodeQL config
  cannot select query packs, model packs, paths, or build behavior. The inline
  configuration selects GitHub's bundled `security-extended` suite and does
  not load repository or external extension packs. The PR's JavaScript,
  TypeScript, and Actions workflow source is still analyzed as untrusted input;
  it is not executed by this scanner. This does not guarantee that another
  repository workflow cannot execute changed PR workflow content.
- No actor, event-author, path, or changed-file filter can skip a targeted PR.
- Pinned official action commits:
  - `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1`
    is release
    <https://github.com/actions/checkout/releases/tag/v7.0.1>; GitHub reports
    the commit signature as verified:
    <https://github.com/actions/checkout/commit/3d3c42e5aac5ba805825da76410c181273ba90b1>.
  - `github/codeql-action@1fc58d04a4d4374f921bdac573c3811c240f9c26`
    is release
    <https://github.com/github/codeql-action/releases/tag/v4.39.2>; GitHub
    reports the commit signature as verified:
    <https://github.com/github/codeql-action/commit/1fc58d04a4d4374f921bdac573c3811c240f9c26>.

## Administrative activation

Perform these steps in one maintenance window. They intentionally preserve the
existing `Documentation` required check while replacing only CodeQL setup.

1. Review the committed `.github/workflows/codeql.yml` on `master`. Confirm the
   two action SHAs, languages, trusted inline configuration, permissions, and
   absence of any `run`, `pull_request_target`, secret, self-hosted runner, or
   ref override. **Permission:** repository read. **Consequence:** none.
   **Expected:** the reviewed file exactly matches this preparation.
   **Recovery:** stop before changing settings if it differs.
2. Open **Settings > Branches > Branch protection rules > master > Edit** and
   record the required checks. **Permission:** repository administrator.
   **Consequence:** none if no value is changed. **Expected:** the existing
   required check is exactly `Documentation`; there is no CodeQL required
   check. **Recovery:** cancel without saving. Do not remove or rename
   `Documentation` during this migration.
3. Open **Settings > Security and quality > Advanced Security > CodeQL
   analysis > Edit configuration** and record every UI-selected language,
   query suite, threat model, model pack, runner, and schedule. **Permission:**
   repository administrator or security manager with the required
   code-security permission. **Consequence:** none if no value is changed.
   **Expected:** languages, default suite, remote threat model, standard
   runner, and weekly schedule match the REST evidence; separately record any
   model packs because the default-setup REST response does not expose
   UI-selected model packs. **Recovery:** cancel without saving. If any trusted
   model pack or other coverage cannot be represented and reviewed safely in
   the advanced configuration, stop the migration rather than lose coverage.
4. Open **Settings > Security and quality > Advanced Security**. In the
   **CodeQL analysis** row, open the menu, choose **Switch to advanced**, then
   choose **Disable CodeQL** in the confirmation dialog, as documented at
   <https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/configure-code-scanning/configuring-advanced-setup-for-code-scanning>.
   **Permission:** repository administrator or security manager with the
   required code-security permission. **Consequence:** this disables managed
   default setup; it does not mean scanning should remain disabled. The
   reviewed advanced workflow must be enabled immediately. **Expected:** the
   managed `dynamic/github-code-scanning/codeql` workflow is no longer active
   and GitHub accepts advanced uploads. **Recovery:** if the replacement cannot
   be enabled or upload, re-enable default setup with the captured languages,
   default query suite, remote threat model, weekly schedule, and standard
   runner. Default and advanced uploads are incompatible, so do not run both.
5. Open **Actions > CodeQL** for `.github/workflows/codeql.yml` and select
   **Enable workflow** if GitHub still shows it as disabled. **Permission:**
   repository Actions write/administration. **Consequence:** future configured
   events can run the reviewed workflow. **Expected:** its state becomes
   active. **Recovery:** disable this workflow and immediately restore default
   setup if activation cannot proceed.
6. On the same workflow page, select **Run workflow**, choose `master`, and run
   it. **Permission:** Actions write. **Consequence:** starts two disposable
   GitHub-hosted jobs and uploads advanced CodeQL results. **Expected:**
   `Analyze (actions)` and `Analyze (javascript-typescript)` both succeed.
   Their logs must show checkout of the `master` SHA and must not show package
   installation, autobuild, repository scripts, builds, or tests. The CodeQL
   tool-status page must identify the advanced workflow and both categories:
   <https://github.com/BabylonJS/Documentation/security/code-scanning/tools/CodeQL/status/>.
   **Recovery:** disable the workflow, inspect the failure without weakening
   permissions or queries, and restore default setup if a safe correction
   cannot be deployed immediately.
7. Confirm the scheduled and push baseline before testing a fork. **Permission:**
   repository/security read. **Consequence:** none. **Expected:** the successful
   analysis SHA equals the selected `master` revision and both categories are
   current. **Recovery:** do not proceed to a fork test until both categories
   succeed.

## Authorized benign fork verification

This preparation does not create a fork, PR, approval, or workflow run. A
repository owner must explicitly authorize the test.

1. Create a benign fork PR targeting `master` that changes only a harmless
   documentation line. Do not edit any workflow, executable content,
   dependency, CodeQL configuration, model pack, secret reference, or action.
   The Actions-language job's pull ref and SHA are sufficient evidence that it
   analyzed the merge revision; the test does not need to modify workflow
   files. **Permission:** contributor plus owner authorization for the test.
   **Consequence:** creates a public PR and may consume Actions minutes.
   **Expected:** the PR is safe to inspect manually. **Recovery:** close the PR
   without merging.
2. Before approving a first-time contributor run, inspect every changed file
   and every queued workflow. The repository setting is
   `first_time_contributors`; approval can release workflows other than CodeQL.
   The default branch currently contains only the repository CodeQL workflow,
   but GitHub-managed dynamic workflows and external checks also exist and must
   be reviewed in the live UI. On the PR, open **Checks > Awaiting approval >
   Approve workflows to run** only after that review. **Permission:** Actions
   approval permission. **Consequence:** approving allows the queued workflows
   for that contribution to run. **Expected:** only reviewed workflows and
   GitHub-managed checks are released. **Recovery:** do not approve; close the
   PR if anything unexpected is queued. Approval must never be treated as a
   routine CodeQL bypass.
3. After explicit approval, verify both CodeQL jobs complete successfully.
   **Permission:** Actions/security read. **Consequence:** none beyond the
   approved run. **Expected:** the `CodeQL` workflow has successful
   `Analyze (actions)` and `Analyze (javascript-typescript)` jobs attached to
   the PR, and the logs show `GITHUB_REF=refs/pull/<number>/merge` with
   `GITHUB_SHA` equal to the tested merge commit. Code-scanning analyses must
   use that pull ref and SHA. **Recovery:** do not merge; disable the advanced
   workflow and restore default setup if the upload path is unsafe or
   incorrect.
4. Close the benign PR without merging after capturing the run URL, pull ref,
   merge SHA, check names, and CodeQL analysis URLs. **Permission:** PR write.
   **Consequence:** ends the test contribution. **Expected:** evidence is
   retained in Actions and code scanning. **Recovery:** reopen only if an
   explicitly authorized retest is required.

Only after step 3 succeeds may the status be changed from **workflow prepared**
to **fork PR successfully scanned**.

The current `first_time_contributors` approval policy does not protect against
workflow changes from returning contributors. The prepared CodeQL scanner is
nonexecuting as reviewed, but that is not a repository-wide guarantee that
other workflows cannot execute PR-controlled content. A stronger approval
policy is an optional, separately approved hardening decision; this migration
does not change it.

## Merge protection after successful scans

The scan jobs and vulnerability-based merge gate are separate controls.

1. Decide thresholds with the repository owner. GitHub offers non-security
   alert thresholds of **None**, **Errors**, **Errors and Warnings**, or
   **All**, and security thresholds of **None**, **Critical**,
   **High or higher**, **Medium or higher**, or **All**. This runbook does not
   choose a threshold because the repository has no existing policy.
2. Open **Settings > Rules > Rulesets > New ruleset > New branch ruleset**.
   Target `master`, leave enforcement disabled while editing, select
   **Require code scanning results**, add **CodeQL**, and enter the
   owner-approved alert thresholds, following
   <https://docs.github.com/en/code-security/how-tos/find-and-fix-code-vulnerabilities/manage-your-configuration/set-merge-protection>.
   **Permission:** repository administrator. **Consequence:** once active, the
   ruleset can block PRs when CodeQL finds alerts at the selected severity, is
   still running, or is not configured. **Expected:** the preview targets only
   `master`, has no bypass actor unless the owner explicitly approves one, and
   names CodeQL. **Recovery:** keep enforcement disabled or delete the draft
   ruleset before activation.
3. Activate the ruleset only after the benign fork test succeeds, then use an
   authorized benign fork update to record the gate while CodeQL is missing or
   pending and after it passes. **Permission:** repository administrator.
   **Consequence:** enables vulnerability-based merge protection. **Expected:**
   the PR is blocked while required CodeQL analysis is missing or in progress,
   then the clean PR passes after both analyses complete. Record these as
   **pending/missing-analysis blocking verified** and **clean result passes**;
   they do not prove that a qualifying alert blocks. **Recovery:** return the
   new ruleset to disabled while retaining the existing `Documentation` branch
   protection; restore it only after correcting the configuration.
4. Do not replace the existing `Documentation` status check with the CodeQL
   ruleset. If the owner also wants execution-status checks, add the exact live
   CodeQL check names to branch protection only after observing them on both a
   push and fork PR, avoiding guessed or stale names. **Permission:** repository
   administrator. **Consequence:** separately blocks on workflow completion.
   **Expected:** existing `Documentation` remains required. **Recovery:** remove
   only the newly added CodeQL status contexts if they deadlock, leaving all
   pre-existing protection intact.
5. Verify qualifying-alert blocking only with a separately authorized,
   pre-existing genuine CodeQL finding that naturally meets the selected
   threshold and whose locations are all in the PR diff. Never create or insert
   a vulnerability, malicious payload, or intentionally unsafe example merely
   to test the gate. **Permission:** explicit repository-owner authorization
   for that existing finding and test PR. **Consequence:** confirms the
   severity threshold actually blocks a real qualifying result. **Expected:**
   GitHub reports the CodeQL rule as blocking until the genuine finding is
   resolved or the authorized test is closed. **Recovery:** close the test PR
   without merging; do not lower thresholds or bypass protections. If no safe
   existing genuine finding is available, record
   **qualifying-alert blocking unverified**.

Do not mark **merge gate verified** from a clean benign PR alone. That test can
verify missing/pending enforcement and a passing result. Mark the full gate
verified only after both missing/pending-analysis blocking and separately
authorized qualifying-alert blocking have been demonstrated. Otherwise report
the verified sub-statuses and keep qualifying-alert blocking explicitly
unverified.

## Merge queue and Dependabot gaps

- No merge queue is configured today. The workflow includes `merge_group` so
  the two CodeQL jobs will execute if a queue is enabled later. GitHub's
  vulnerability-based code-scanning ruleset does **not** apply to merge queue
  groups. Therefore queue enforcement must separately require the observed
  CodeQL job status checks, and queue behavior must be tested after enabling a
  queue. A successful `merge_group` scan is not proof of vulnerability-based
  queue gating.
- GitHub also documents that code-scanning rulesets do not apply to Dependabot
  PRs analyzed by default setup. This migration uses advanced setup, but no
  Dependabot exception was tested. Treat Dependabot gate behavior as unverified
  and validate it separately before claiming coverage.
- Code-scanning merge protection evaluates alerts only when all alert
  locations exist in the PR diff. It is not a general baseline-alert gate.
- `Locations for an alert exceeded limits` is a SARIF soft-limit warning that
  truncates supporting locations; it does not mean the upload failed. Record
  the warning and confirm the alert's primary location and result remain
  usable. Do not reduce findings or paths, disable a query, weaken
  `security-extended`, or add source exclusions merely to remove the warning.
