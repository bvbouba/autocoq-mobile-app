// --------------------
// Types
// --------------------
type FAQHeaderBlock = {
	id: string;
	type: "header";
	data: {
		text: string;
		level: number;
	};
};

type FAQListBlock = {
	id: string;
	type: "list";
	data: {
		items: string[];
		style: "unordered" | "ordered";
	};
};

type FAQBlock = FAQHeaderBlock | FAQListBlock;

export type FAQData = {
	time: number;
	blocks: FAQBlock[];
	version: string;
};

export type FAQPair = {
	question: string;
	answer: string[];
};
