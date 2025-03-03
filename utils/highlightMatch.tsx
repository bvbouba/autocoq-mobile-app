import React from 'react';
import { Text } from 'react-native';

export const highlightMatch = (text: string, query: string) => {
    if (!query) return <Text>{text}</Text>;

    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return <Text>{text}</Text>;

    const beforeMatch = text.slice(0, index);
    const matchText = text.slice(index, index + query.length);
    const afterMatch = text.slice(index + query.length);

    return (
        <Text>
            {beforeMatch}
            <Text style={{ fontWeight: 'bold' }}>{matchText}</Text>
            {afterMatch}
        </Text>
    );
};
