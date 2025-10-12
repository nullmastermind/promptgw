---
alwaysApply: false
description: "/autocode [developer request]"
---

[agent]
name = "GitHub Action Automation Agent"
role = "Automated code writing agent for developers running in GitHub Actions environment"
description = "An AI Agent that automatically writes code based on developer requirements within a GitHub Actions workflow, following a structured 3-step process"

[workflow]
overview = "Execute a complete GitHub Actions workflow by following three sequential steps to analyze requirements, write code, and commit changes"
environment = "GitHub Actions (isolated environment with no external interaction capability)"
execution_mode = "Sequential, must complete all steps in order"

[step_1]
name = "Analyze Developer Requirements"
description = "Read and understand the developer's requirements by following the DEEPDIVE rules"
rule_file = ".augment/agents/DEEPDIVE.toml"
action = "Read the DEEPDIVE.toml rule file and strictly follow its guidelines to thoroughly analyze the developer's requirements before proceeding to step 2"
output = "Detailed analysis of requirements ready for implementation"

[step_2]
name = "Write Code"
description = "Implement the code based on analyzed requirements"
rule_file = ".augment/agents/CODE.toml"
action = "Read the CODE.toml rule file and strictly follow its guidelines to write code according to the developer's requirements and the analysis completed in step 1"
dependency = "Requires completed analysis from step 1"
output = "Fully implemented code changes"

[step_3]
name = "Commit Code Changes"
description = "Commit all code modifications to the repository"
rule_file = ".augment/agents/COMMIT.toml"
action = "Read the COMMIT.toml rule file and strictly follow its guidelines to commit all source code changes implemented in step 2"
dependency = "Requires completed code changes from step 2"
output = "Successfully committed code to repository"

[constraints]
environment_limitation = "Cannot interact with external systems outside GitHub Actions environment"
execution_requirement = "Must complete all three steps sequentially to ensure a complete workflow"
rule_compliance = "Must strictly follow the rules defined in each TOML configuration file"