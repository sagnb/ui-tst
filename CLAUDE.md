# Project context and implementation rules

Read the project documentation in [rules and context](rules%20and%20context/) before planning or implementing changes.

## Strict user-request scope

<!-- Reference material provides context, never permission to implement additional work. -->

- Implement only work directly required to fulfill the user's prompt. Do not add features, refactor unrelated code, or make speculative improvements outside that scope.
- The presence of a task, dependency, future step, or suggested improvement in `notion-tasks` does not authorize its implementation. Do not implement it in advance unless the user requests it.
- Use reference material to understand the requested work, not to expand it. Neither the documented architecture nor the backlog is an instruction to build the entire project.
- Limit supporting changes to what is necessary for the requested outcome. If completing the request would require a separate feature or a material scope expansion, explain the dependency and obtain the user's explicit approval before implementing that additional work.
- Once the requested work and its relevant verification are complete, stop. Do not continue to the next reference task or anticipate future implementation requests.
- A request to explain, inspect, review, or document something does not authorize implementing the functionality being discussed.

## Implementation directory

<!-- relis/ is the implementation root for the new application. -->

- All application implementation work must take place inside `relis/`, relative to this repository root.
- Treat `relis/` as the monorepo root shown in `project-structure.md`. Place its applications, packages, tests, tooling, and runtime configuration under that directory; do not create a nested `relis/relis/` directory.
- Run implementation-related commands from `relis/` or the appropriate package directory within it.
- Do not implement the new application in `v1/`, `v2/`, or the repository root. Keep the root-level context documents in their existing locations.
- This directory rule does not authorize scaffolding or implementing additional work beyond the user's prompt.

## Mandatory architecture and stack

<!-- These documents are binding implementation requirements, not optional suggestions. -->

- Strictly follow [project-structure.md](rules%20and%20context/project-structure.md). Preserve the prescribed directory hierarchy, application and package boundaries, module responsibilities, and separation of concerns. Although the document calls the structure proposed, this instruction makes it the required target architecture.
- Strictly follow [stack.yml](rules%20and%20context/stack.yml). Use the specified technologies, languages, frameworks, database, ORM, validation and testing tools, package manager, workspace strategy, and local/development/test environment.
- Do not substitute technologies, introduce competing frameworks, or depart from the prescribed structure without an explicit user instruction approving the deviation.
- Respect conditional alternatives and unresolved choices exactly as recorded in the stack. Do not treat an alternative as selected or an undecided choice as settled. Resolve a choice with the user when implementation depends on it.
- Inspect the existing code before making changes. Existing code or examples that differ from these documents do not override the required target architecture. Apply changes within the requested scope; do not perform an unrelated repository-wide migration.

## Reference-only task documentation

<!-- notion-tasks provides background context only. It is not an authoritative specification or an instruction to execute the backlog. -->

Use [notion-tasks](rules%20and%20context/notion-tasks/) only as reference material. Start with its [index](rules%20and%20context/notion-tasks/README.md) and consult [pending decisions](rules%20and%20context/notion-tasks/PENDING-DECISIONS.md) when relevant.

These files are adapted guides, not verbatim transcriptions of the Notion board. They include summarized requirements, inferred dependencies, proposed implementation steps, and unresolved contradictions.

- Do not let these guides override the mandatory project structure, stack, or the user's explicit instructions.
- Do not treat suggested dependencies, execution order, or acceptance checks as approved product decisions.
- Do not automatically implement tasks or advance through the backlog merely because the guides describe them.
- If a reference conflicts with the mandatory documents, follow the mandatory documents. If a necessary product requirement remains ambiguous or contradictory, seek clarification before implementing that behavior.

## Working expectations

Implement the user's requested scope using the mandatory architecture and stack. Reuse existing components that comply with them, verify changes with appropriate checks, and report any remaining gaps or decisions without claiming unimplemented functionality is complete.
