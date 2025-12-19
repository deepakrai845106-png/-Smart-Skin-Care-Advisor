// DOM Elements
const darkModeToggle = document.getElementById('darkModeToggle');
const startAnalysisBtn = document.getElementById('startAnalysisBtn');
const uploadArea = document.getElementById('uploadArea');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImageBtn');
const skinForm = document.getElementById('skinForm');
const resetFormBtn = document.getElementById('resetFormBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultSection = document.getElementById('resultSection');
const editResponsesBtn = document.getElementById('editResponsesBtn');
const printBtn = document.getElementById('printBtn');

// Result elements
const facewashResult = document.getElementById('facewashResult');
const morningRoutine = document.getElementById('morningRoutine');
const nightRoutine = document.getElementById('nightRoutine');
const weeklyTips = document.getElementById('weeklyTips');
const avoidResult = document.getElementById('avoidResult');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Scroll to form when clicking "Start Analysis"
    startAnalysisBtn.addEventListener('click', () => {
        document.getElementById('uploadSection').scrollIntoView({ behavior: 'smooth' });
    });
});

// Set up all event listeners
function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);
    
    // Image upload functionality
    uploadArea.addEventListener('click', () => imageUpload.click());
    imageUpload.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeUploadedImage);
    
    // Form functionality
    skinForm.addEventListener('submit', handleFormSubmit);
    resetFormBtn.addEventListener('click', resetForm);
    
    // Result section buttons
    editResponsesBtn.addEventListener('click', editResponses);
    printBtn.addEventListener('click', printRecommendations);
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Handle Image Upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        imagePreview.style.display = 'block';
        uploadArea.style.display = 'none';
    };
    
    reader.readAsDataURL(file);
}

// Remove uploaded image
function removeUploadedImage() {
    imageUpload.value = '';
    imagePreview.style.display = 'none';
    uploadArea.style.display = 'block';
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const skinType = document.getElementById('skinType').value;
    const acne = document.querySelector('input[name="acne"]:checked')?.value;
    const sensitive = document.querySelector('input[name="sensitive"]:checked')?.value;
    const ageGroup = document.getElementById('ageGroup').value;
    const gender = document.getElementById('gender').value;
    
    // Generate recommendations
    const recommendations = generateRecommendations(skinType, acne, sensitive, ageGroup, gender);
    
    // Update result elements
    facewashResult.textContent = recommendations.facewash;
    morningRoutine.textContent = recommendations.morningRoutine;
    nightRoutine.textContent = recommendations.nightRoutine;
    weeklyTips.textContent = recommendations.weeklyTips;
    avoidResult.textContent = recommendations.avoid;
    
    // Show result section
    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Reset form
function resetForm() {
    skinForm.reset();
    resultSection.style.display = 'none';
}

// Edit responses
function editResponses() {
    resultSection.style.display = 'none';
    document.getElementById('formSection').scrollIntoView({ behavior: 'smooth' });
}

// Print recommendations
function printRecommendations() {
    const printContent = `
        <html>
            <head>
                <title>Smart Skin Care Advisor - Personalized Recommendations</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h1 { color: #2d8f7c; }
                    h2 { color: #333; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
                    .section { margin-bottom: 20px; }
                    .disclaimer { background-color: #fff8e1; padding: 10px; border-left: 3px solid #f5a623; font-size: 14px; }
                </style>
            </head>
            <body>
                <h1>Smart Skin Care Advisor - Personalized Recommendations</h1>
                <div class="section">
                    <h2>Recommended Facewash</h2>
                    <p>${facewashResult.textContent}</p>
                </div>
                <div class="section">
                    <h2>Morning Routine</h2>
                    <p>${morningRoutine.textContent}</p>
                </div>
                <div class="section">
                    <h2>Night Routine</h2>
                    <p>${nightRoutine.textContent}</p>
                </div>
                <div class="section">
                    <h2>Weekly Care Tips</h2>
                    <p>${weeklyTips.textContent}</p>
                </div>
                <div class="section">
                    <h2>Things to Avoid</h2>
                    <p>${avoidResult.textContent}</p>
                </div>
                <div class="disclaimer">
                    <strong>Disclaimer:</strong> This tool provides general skincare guidance only. It is not medical advice. Always consult with a dermatologist or qualified healthcare provider for personalized medical advice.
                </div>
                <p><br>Generated by Smart Skin Care Advisor on ${new Date().toLocaleDateString()}</p>
            </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load before printing
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 250);
}

// Generate skincare recommendations based on user input
function generateRecommendations(skinType, acne, sensitive, ageGroup, gender) {
    // Base recommendations structure
    let recommendations = {
        facewash: '',
        morningRoutine: '',
        nightRoutine: '',
        weeklyTips: '',
        avoid: ''
    };
    
    // Determine facewash recommendation
    if (acne === 'yes') {
        if (sensitive === 'yes') {
            recommendations.facewash = 'Gentle salicylic acid or benzoyl peroxide facewash (2.5% or less). Look for formulas with soothing ingredients like aloe vera or chamomile.';
        } else {
            recommendations.facewash = 'Salicylic acid (2%) or benzoyl peroxide (2.5-5%) facewash to combat acne-causing bacteria and unclog pores.';
        }
    } else {
        switch(skinType) {
            case 'oily':
                recommendations.facewash = 'Oil-control facewash with tea tree oil, niacinamide, or clay-based cleansers to regulate sebum without over-drying.';
                break;
            case 'dry':
                recommendations.facewash = 'Creamy, hydrating cleanser with ceramides, hyaluronic acid, or glycerin. Avoid foaming cleansers that can strip natural oils.';
                break;
            case 'combination':
                recommendations.facewash = 'Gentle, pH-balanced gel or foam cleanser that addresses both oily T-zone and drier cheek areas.';
                break;
            case 'normal':
                recommendations.facewash = 'Mild, hydrating cleanser that maintains skin\'s natural balance. Look for sulfate-free formulas.';
                break;
        }
    }
    
    // Determine morning routine
    switch(skinType) {
        case 'oily':
            recommendations.morningRoutine = '1. Cleanse with recommended facewash. 2. Apply alcohol-free toner. 3. Use oil-free moisturizer with SPF 30+. 4. Optional: Vitamin C serum for antioxidant protection.';
            break;
        case 'dry':
            recommendations.morningRoutine = '1. Cleanse with recommended facewash (or just splash with water if skin is very dry). 2. Apply hydrating serum with hyaluronic acid. 3. Use rich moisturizer. 4. Apply broad-spectrum sunscreen SPF 30+.';
            break;
        case 'combination':
            recommendations.morningRoutine = '1. Cleanse with recommended facewash. 2. Apply balancing toner. 3. Use light moisturizer, applying more to dry areas. 4. Apply broad-spectrum sunscreen SPF 30+.';
            break;
        case 'normal':
            recommendations.morningRoutine = '1. Cleanse with recommended facewash. 2. Apply antioxidant serum (Vitamin C). 3. Use light moisturizer. 4. Apply broad-spectrum sunscreen SPF 30+.';
            break;
    }
    
    // Determine night routine
    if (acne === 'yes') {
        recommendations.nightRoutine = '1. Double cleanse if wearing makeup/sunscreen. 2. Use recommended facewash. 3. Apply acne treatment (salicylic acid or benzoyl peroxide spot treatment). 4. Use oil-free, non-comedogenic moisturizer.';
        
        if (ageGroup === '26-35' || ageGroup === '36+') {
            recommendations.nightRoutine += ' 5. Consider retinol (start with low concentration 1-2 times weekly) for anti-aging benefits.';
        }
    } else {
        switch(skinType) {
            case 'oily':
                recommendations.nightRoutine = '1. Double cleanse if wearing makeup/sunscreen. 2. Use recommended facewash. 3. Apply niacinamide serum. 4. Use oil-free night moisturizer.';
                break;
            case 'dry':
                recommendations.nightRoutine = '1. Double cleanse if wearing makeup/sunscreen. 2. Use recommended facewash. 3. Apply hyaluronic acid serum on damp skin. 4. Use richer night cream or face oil. 5. Consider using a humidifier.';
                break;
            case 'combination':
                recommendations.nightRoutine = '1. Double cleanse if wearing makeup/sunscreen. 2. Use recommended facewash. 3. Apply hydrating serum to dry areas. 4. Use lightweight night moisturizer, applying more to dry areas.';
                break;
            case 'normal':
                recommendations.nightRoutine = '1. Double cleanse if wearing makeup/sunscreen. 2. Use recommended facewash. 3. Apply treatment serum (retinol or peptides for anti-aging). 4. Use night moisturizer.';
                break;
        }
    }
    
    // Determine weekly tips
    if (acne === 'yes') {
        recommendations.weeklyTips = '1. Use clay mask 1-2 times weekly to absorb excess oil. 2. Avoid physical exfoliation if skin is inflamed. 3. Change pillowcases twice weekly.';
    } else {
        switch(skinType) {
            case 'oily':
                recommendations.weeklyTips = '1. Use clay mask once weekly. 2. Gently exfoliate 2-3 times weekly with BHA (salicylic acid). 3. Use oil-absorbing sheets as needed.';
                break;
            case 'dry':
                recommendations.weeklyTips = '1. Use hydrating sheet mask once weekly. 2. Gently exfoliate once weekly with AHA (lactic or glycolic acid). 3. Avoid long, hot showers.';
                break;
            case 'combination':
                recommendations.weeklyTips = '1. Use clay mask on T-zone once weekly. 2. Gently exfoliate 1-2 times weekly. 3. Spot treat oily areas as needed.';
                break;
            case 'normal':
                recommendations.weeklyTips = '1. Use any mask type based on current skin needs. 2. Exfoliate 1-2 times weekly. 3. Consider incorporating facial massage for circulation.';
                break;
        }
    }
    
    // Determine things to avoid
    if (sensitive === 'yes') {
        recommendations.avoid = '1. Fragranced products. 2. Alcohol-based toners. 3. Physical scrubs with rough particles. 4. Essential oils. 5. Hot water on face. 6. Over-exfoliation.';
    } else {
        switch(skinType) {
            case 'oily':
                recommendations.avoid = '1. Heavy, oil-based creams. 2. Comedogenic ingredients (coconut oil, cocoa butter). 3. Skipping moisturizer. 4. Over-washing (more than twice daily). 5. Touching face frequently.';
                break;
            case 'dry':
                recommendations.avoid = '1. Foaming cleansers. 2. Alcohol-based products. 3. Long, hot showers. 4. Harsh physical exfoliation. 5. Indoor heaters without humidifier.';
                break;
            case 'combination':
                recommendations.avoid = '1. Over-drying oily areas. 2. Ignoring dry areas. 3. Using products meant for only one skin type. 4. Inconsistent routine.';
                break;
            case 'normal':
                recommendations.avoid = '1. Overcomplicating routine with too many products. 2. Harsh ingredients unnecessarily. 3. Skipping sunscreen. 4. Not adjusting routine with seasons.';
                break;
        }
    }
    
    // Age-specific adjustments
    if (ageGroup === 'under18') {
        recommendations.avoid += ' Avoid aggressive anti-aging treatments unless prescribed by dermatologist.';
    } else if (ageGroup === '36+') {
        recommendations.morningRoutine += ' Consider adding antioxidant serum for anti-aging benefits.';
        recommendations.avoid += ' Avoid skipping moisturizer as skin naturally produces less oil with age.';
    }
    
    return recommendations;
}