# Priority Rules (override default if there is a duplicate) (TOML formatted)

[language]
rule = "WHEN A USER ASKS IN A LANGUAGE OTHER THAN ENGLISH, PLEASE REITERATE THE USER'S REQUEST IN YOUR UNDERSTANDING IN ENGLISH BEFORE STARTING TO DO THE REQUEST. ALWAYS THINK, ANSWER, PERFORM IN ENGLISH."

[code_usage]
no_unused_code = "Don't write code without using it; ensure everything written is utilized in the project."

[comments]
explain_what_and_why = "Comments must explain 'what' and 'why', not 'how' - code should be self-explanatory in implementation. Specifically: 'what' refers to the business logic or purpose the code serves, 'why' explains the reasoning behind design decisions, trade-offs made, or non-obvious choices. The 'how' should be evident from clean, well-structured code with meaningful variable names and clear control flow."
avoid_over_commenting = "Avoid over-commenting - excessive comments indicate poor code quality. A well-written codebase needs minimal comments because the code itself communicates clearly. If you find yourself writing many comments to explain code, refactor the code instead. Comments should be rare and valuable, not cluttering every line."
function_comments = "Function comments must explain purpose and reasoning, placed at function beginnings."

[code_quality]
readability_first = "Code must prioritize readability for human understanding over computer execution efficiency."
long_term_maintainability = "Maintain long-term maintainability over short-term optimization."
data_structures_first = "Understand and design proper data structures first - good data structures lead to good code."
avoid_complexity = "Avoid unnecessary complexity - implement simple solutions unless complexity is truly required."
linus_principles = "New code you write is garbage if it doesn't follow Linus Torvalds' clean code principles - the father of Linux. These principles include: keep it simple and obvious, make code readable like good prose, avoid premature optimization, write code that clearly expresses intent, minimize abstraction layers, and never add functionality 'just in case' - only implement what's needed now. Remember: good taste in code means knowing when to stop adding features and complexity."

[implementation_workflow]
understand_first = "Before implementation, first use provided reading, searching, browsing, web, and other tools to understand the data structure of the request."
avoid_over_engineering = "Avoid over-engineering - focus on delivering the minimal viable solution that meets the specified acceptance criteria."
tests_only_if_required = "Only create automated tests if explicitly required in the original requirements."
define_data_structures = "Define all data input/output structures first before writing any logic."
define_function_signatures = "Define all function input parameters and return values before implementation."
define_all_functions = "Define all required functions and their signatures at once before writing implementation logic."
logic_last = "Implementation logic should be written only after all data structures and function definitions are complete."

[quality_assurance]
always_run_check = "ALWAYS run `bun run check` at root directory after writing code to ensure code quality and type safety."
linter_and_typecheck = "This runs both linter (biome) and typecheck (tsc). NEVER run biome with --unsafe, manually fix all errors."
must_pass_checks = "Code must pass both lint and typecheck before being considered complete."

