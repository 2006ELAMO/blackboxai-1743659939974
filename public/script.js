document.addEventListener('DOMContentLoaded', () => {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('fileInput');
    const progress = document.getElementById('progress');
    const statusText = document.getElementById('statusText');
    const downloadBtn = document.getElementById('downloadBtn');
    const errorAlert = document.getElementById('errorAlert');
    const errorText = document.getElementById('errorText');
    const successAlert = document.getElementById('successAlert');

    let convertedFile = null;

    // Handle drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dropzone.classList.add('active');
    }

    function unhighlight() {
        dropzone.classList.remove('active');
    }

    // Handle dropped files
    dropzone.addEventListener('drop', handleDrop, false);
    dropzone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', handleFiles);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles({ target: { files } });
    }

    function handleFiles(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file extension
        if (!file.name.toLowerCase().endsWith('.bf')) {
            showError('Please upload a .bf file');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showError('File size must be less than 10MB');
            return;
        }

        // Show progress
        progress.classList.remove('hidden');
        statusText.textContent = 'Converting file...';
        errorAlert.classList.add('hidden');
        successAlert.classList.add('hidden');
        downloadBtn.disabled = true;

        // Simulate conversion (to be replaced with actual API call)
        setTimeout(() => {
            // In a real implementation, this would be an API call to the backend
            // For now, we'll just mock the conversion
            mockConvertFile(file)
                .then(result => {
                    convertedFile = result;
                    progress.classList.add('hidden');
                    successAlert.classList.remove('hidden');
                    downloadBtn.disabled = false;
                })
                .catch(err => {
                    progress.classList.add('hidden');
                    showError(err.message);
                });
        }, 1500);
    }

    // Mock conversion function (to be replaced with actual implementation)
    function mockConvertFile(file) {
        return new Promise((resolve, reject) => {
            // Simulate reading the file
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    // In a real implementation, this would convert the file format
                    // For now, we'll just return a modified version of the input
                    const arrayBuffer = e.target.result;
                    const convertedData = new Uint8Array(arrayBuffer);
                    
                    // Mock some changes to simulate conversion
                    // (In reality, this would involve actual format conversion)
                    convertedData[0] = 0x50; // PS3 identifier
                    convertedData[1] = 0x53;
                    convertedData[2] = 0x33;

                    resolve(new Blob([convertedData], { type: 'application/octet-stream' }));
                } catch (err) {
                    reject(new Error('Failed to convert file'));
                }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsArrayBuffer(file);
        });
    }

    // Download handler
    downloadBtn.addEventListener('click', () => {
        if (!convertedFile) return;
        
        const url = URL.createObjectURL(convertedFile);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted_ps3.bf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    function showError(message) {
        errorText.textContent = message;
        errorAlert.classList.remove('hidden');
    }
});