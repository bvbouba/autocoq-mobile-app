const fs = require("fs");
const glob = require("glob");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;

// Function to check if a string is translatable UI text
const isTranslatableText = (text) => {
    return /[a-zA-Z]/.test(text) && !text.startsWith("<") && !text.startsWith("{");
};

// Function to extract UI text from JSX <Text> tags and component props
const extractTextsFromFile = (filePath) => {
    const fileContent = fs.readFileSync(filePath, "utf8");
    let texts = [];

    try {
        const ast = parser.parse(fileContent, {
            sourceType: "module",
            plugins: ["jsx", "typescript"],
        });

        traverse(ast, {
            // Extract text inside <Text>...</Text> elements
            JSXElement({ node }) {
                if (node.openingElement.name.name === "Text") {
                    const textNode = node.children.find((child) => child.type === "JSXText");
                    if (textNode) {
                        const textValue = textNode.value.trim();
                        if (isTranslatableText(textValue)) {
                            texts.push(textValue);
                        }
                    }
                }
            },

            // Extract props like label="Submit", title="My Page"
            JSXAttribute({ node }) {
                const propName = node.name.name;
                if (["label", "title", "placeholder", "alt"].includes(propName)) {
                    if (node.value && node.value.type === "StringLiteral") {
                        const textValue = node.value.value.trim();
                        if (isTranslatableText(textValue)) {
                            texts.push(textValue);
                        }
                    }
                }
            },
        });
    } catch (error) {
        console.error(`Error parsing file: ${filePath}`, error.message);
    }

    return texts.length > 0 ? { filePath, texts } : null;
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
            const result = extractTextsFromFile(file);
            if (result) results.push(result);
        });

        // Output the results
        console.log("🔍 Extracted UI Texts:");
        results.forEach(({ filePath, texts }) => {
            console.log(`\n📂 File: ${filePath}`);
            texts.forEach((text) => console.log(`  - ${text}`));
        });
    });
};

// Run script on your project
searchTsxFiles("./utils"); // Change "./src" to match your folder structure
