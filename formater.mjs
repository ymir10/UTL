// prodduction ready formater


function formater(){

}





/*
// use for advance data formating, and handeling
//// guide :
////// formatBytes: format bytes to human readable format
////// formatDate: format date to human readable format
////// formatDuration: format duration to human readable format
////// formatNumber: format number to human readable format with commas and suffixes (K, M, B, T)
////// formatURL: ensure url is properly formatted with protocol and trailing slash

const Formater = {

    formatBytes: async function (bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    formatDate: async function (date) {
        const d = new Date(date);
        return d.toLocaleString();
    },
    formatDuration: async function (seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${hrs}h ${mins}m ${secs}s`;
    },

    formatNumber: async function (number) {
        if (number >= 1e12) return (number / 1e12).toFixed(2) + 'T';
        if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
        if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
        if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    formatURL: async function (url) {
        try {
            let formattedURL = new URL(url);
            return formattedURL.href.endsWith('/') ? formattedURL.href : formattedURL.href + '/';
        } catch (error) {
            throw new Error('Invalid URL');
        }
    }


};
*/



export default Formater;