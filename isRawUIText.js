const fs = require("fs");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

// Function to check if a string is plain UI text (not a JSX tag or expression)
const isPlainText = (text) => {
    return /[a-zA-Z]/.test(text) && !text.startsWith("<") && !text.startsWith("{");
};

// Function to check if text is outside a <Text> component
const checkTextOutsideTextTag = (filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf8");
    let warnings = [];

    try {
        const ast = parser.parse(fileContent, {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
        });

        traverse(ast, {
            // Find text nodes in JSX
            JSXText({ node, parent }) {
                const textValue = node.value.trim();

                // If the text is meaningful and not inside a <Text> component
                if (isPlainText(textValue) && parent.openingElement.name.name !== "Text") {
                    warnings.push(textValue);
                }
            },
        });
    } catch (error) {
        console.error(`Error parsing file: ${filePath}`, error.message);
    }

    return warnings.length > 0 ? { filePath, warnings } : null;
};

// Scan all .tsx files
const searchTsxFiles = (directory) => {
    glob(`${directory}/**/*.tsx`, (err, files) => {
        if (err) {
            console.error("Error finding files:", err);
            return;
        }

        let results = [];

        files.forEach((file) => {
            const result = checkTextOutsideTextTag(file);
            if (result) results.push(result);
        });

        // Output results
        if (results.length === 0) {
            console.log("✅ No raw UI text found outside <Text> tags!");
        } else {
            console.log("⚠️  Text found outside <Text> tags:");
            results.forEach(({ filePath, warnings }) => {
                console.log(`\n📂 File: ${filePath}`);
                warnings.forEach((text) => console.log(`  - ❌ "${text}"`));
            });
        }
    });
};

// Run the script
searchTsxFiles("./components"); // Change "./src" to your project folder
