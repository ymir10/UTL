// prodduction ready texter
// use for advance string extraxtion, replacement, and handeling
//// giude :
////// extractBetween: extract string between two strings
////// sanitize: remove illegal characters from string for file naming
////// replaceALL: improved replaceALL now takes string and array!!! for patterns and replacements, 1 replacement can be used for multiple patterns, and excess patterns will be replaced with the last replacement
////// replace: same as replaceALL but only replaces the first occurrence of each pattern
////// removeALL: remove all occurrences of patterns from string, takes string and array for patterns
////// remove: same as removeALL but only removes the first occurrence of each pattern

const Texter = {

    extractBetween: async function (text, before, after) {
        if (!text) return null;
        const startIndex = text.indexOf(before);
        if (startIndex === -1) return null;
        const fromIndex = startIndex + before.length;
        const endIndex = text.indexOf(after, fromIndex);
        if (endIndex === -1) return null;
        return text.substring(fromIndex, endIndex).trim();
    },


    sanitize: async function (str){
        return str.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();
    },


    replaceALL: async function (strs, _patterns, _replacements) {
        let patterns = Array.isArray(_patterns) ? _patterns : [_patterns];
        let replacements = Array.isArray(_replacements) ? _replacements : [_replacements];
        if (patterns.length < replacements.length) {
            throw new Error('replacements can not be more than patterns');
        }
        let result = strs;

        if(patterns.length == replacements.length ){
            for (let i = 0; i < patterns.length; i++) {
                const pattern = patterns[i];
                const replacement = replacements[i];
                result = result.replaceAll(pattern, replacement);
            }
            return result;
        }else if(replacements.length == 1){
            const replacement = replacements[0];
            for (let i = 0; i < patterns.length; i++) {
                const pattern = patterns[i];
                result = result.replaceAll(pattern, replacement);
            }
            return result;


        }else if (patterns.length > replacements.length ){
            const patterns1 =  patterns.slice(0, replacements.length - 2);
            const patterns2 =  patterns.slice(replacements.length - 2);

            for (let i = 0; i < patterns1.length; i++) {
                const pattern = patterns1[i];
                const replacement = replacements[i];
                result = result.replaceAll(pattern, replacement);
            }
            const lastReplacement = replacements[replacements.length - 1];
            for (let j = 0; j < patterns2.length; j++) {
                const pattern = patterns2[j];
                result = result.replaceAll(pattern, lastReplacement);
            }
            return result;

        }
    
    }, 


    replace: async function (strs, _patterns, _replacements) {
        let patterns = Array.isArray(_patterns) ? _patterns : [_patterns];
        let replacements = Array.isArray(_replacements) ? _replacements : [_replacements];
        if (patterns.length < replacements.length) {
            throw new Error('replacements can not be more than patterns');
        }
        let result = strs;

        if(patterns.length == replacements.length ){
            for (let i = 0; i < patterns.length; i++) {
                const pattern = patterns[i];
                const replacement = replacements[i];
                result = result.replace(pattern, replacement);
            }
            return result;
        }else if(replacements.length == 1){
            const replacement = replacements[0];
            for (let i = 0; i < patterns.length; i++) {
                const pattern = patterns[i];
                result = result.replace(pattern, replacement);
            }
            return result;


        }else if (patterns.length > replacements.length ){
            const patterns1 =  patterns.slice(0, replacements.length - 2);
            const patterns2 =  patterns.slice(replacements.length - 2);

            for (let i = 0; i < patterns1.length; i++) {
                const pattern = patterns1[i];
                const replacement = replacements[i];
                result = result.replace(pattern, replacement);
            }
            const lastReplacement = replacements[replacements.length - 1];
            for (let j = 0; j < patterns2.length; j++) {
                const pattern = patterns2[j];
                result = result.replace(pattern, lastReplacement);
            }
            return result;

        }
    
    },

    removeAll: async function(strs, _patterns) {
        let patterns = Array.isArray(_patterns) ? _patterns : [_patterns];
        let result = strs;
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            result = result.replaceAll(pattern, '');
        }
        return result;
    },

    remove: async function(strs, _patterns) {
        let patterns = Array.isArray(_patterns) ? _patterns : [_patterns];
        let result = strs;
        for (let i = 0; i < patterns.length; i++) {
            const pattern = patterns[i];
            result = result.replace(pattern, '');
        }
        return result;
    }

}

export default Texter;