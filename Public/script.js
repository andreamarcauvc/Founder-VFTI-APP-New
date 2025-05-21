document.addEventListener("DOMContentLoaded", function () {
    const startTestButton = document.getElementById("startTest");
    const testSection = document.getElementById("testSection");
    const questionnaire = document.getElementById("questionnaire");
    const resultSection = document.getElementById("resultSection");
    const emailCollectionSection = document.getElementById("emailCollectionSection");
    const submitEmailButton = document.getElementById("submitEmail");

    if (startTestButton) {
        startTestButton.addEventListener("click", function () {
            questionnaire.style.display = "none";
            emailCollectionSection.style.display = "block";
        });
    }

    if (submitEmailButton) {
        submitEmailButton.addEventListener("click", function () {
            const founderName = document.getElementById("founderName").value;
            const startupName = document.getElementById("startupName").value;
            const email = document.getElementById("email").value;

            if (founderName && startupName && email) {
                emailCollectionSection.style.display = "none";
                testSection.style.display = "block";
                shuffleQuestions();
                loadQuestion();
            } else {
                alert("Please fill in all the fields.");
            }
        });
    }
});

let questions = [
    { q: "When starting a new project, what aspect energizes you the most?", o1: "Envisioning the long-term impact and innovative possibilities.", o2: "Laying out a detailed plan to execute the project effectively.", category: "VE" },
    // ... (other questions) ...
    { q: "You gauge success primarily by:", o1: "Gauge success by market adoption.", o2: "Gauge success by product quality.", category: "MP" }
];

let responses = [];
let currentQuestion = 0;

function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById("progressBar").style.width = `${progress}%`;
}

let dimension_descriptions = {
    "V": "Visionary (V): You are driven by big ideas and future possibilities...",
    "E": "Executor (E): You excel at turning ideas into reality...",
    "A": "Adaptable (A): You are flexible and open to change...",
    "C": "Consistent (C): You value stability and steadfastness...",
    "I": "Independent (I): You prefer to work autonomously...",
    "C2": "Collaborative (C): You thrive in team settings...",
    "M": "Market-Centric (M): You focus on understanding customer needs...",
    "P": "Product-Centric (P): You are passionate about developing and refining your product..."
};

let cofounder_suggestions = {
    "VAIM": "Look for co-founders who excel in execution...",
    // ... (other suggestions) ...
    "ECCP": "Seek a visionary strategist who connects your product to future market demands..."
};

function shuffleQuestions() {
    let questionGroups = [
        questions.slice(0, 5),
        questions.slice(5, 10),
        questions.slice(10, 15),
        questions.slice(15)
    ];
    questionGroups = questionGroups.map(group => group.sort(() => Math.random() - 0.5));
    questions = [
        questionGroups[0],
        questionGroups[1],
        questionGroups[2],
        questionGroups[3]
    ].flat();
}

function shuffleAnswers(question) {
    question.swapped = Math.random() > 0.5;
}

function loadQuestion() {
    if (currentQuestion < questions.length) {
        const question = questions[currentQuestion];
        if (question.swapped === undefined) shuffleAnswers(question);
        document.getElementById("question").innerText = question.q;
        document.getElementById("option1").innerText = question.swapped ? question.o2 : question.o1;
        document.getElementById("option2").innerText = question.swapped ? question.o1 : question.o2;
        updateProgressBar();
        highlightSelectedOption();
        document.getElementById("backButton").disabled = currentQuestion === 0;
        document.getElementById("forwardButton").disabled = !responses[currentQuestion];
    } else {
        submitTest();
    }
}

function chooseOption(option) {
    const question = questions[currentQuestion];
    const value = question.swapped ? (option === 1 ? 2 : 1) : option;
    responses[currentQuestion] = { category: question.category, value };
    highlightSelectedOption();
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function highlightSelectedOption() {
    const question = questions[currentQuestion];
    const saved = responses[currentQuestion];
    document.getElementById("option1").classList.remove("selected");
    document.getElementById("option2").classList.remove("selected");
    if (saved && saved.value === (question.swapped ? 2 : 1)) {
        document.getElementById("option1").classList.add("selected");
    } else if (saved && saved.value === (question.swapped ? 1 : 2)) {
        document.getElementById("option2").classList.add("selected");
    }
}

function goForward() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    } else {
        submitTest();
    }
}

function goBack() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function submitTest() {
    const scores = { VE: 0, AC: 0, IC: 0, MP: 0 };
    responses.forEach(r => { if (r.value === 1) scores[r.category]++; });
    const dominant_traits = [
        scores.VE > 2 ? 'V' : 'E',
        scores.AC > 2 ? 'A' : 'C',
        scores.IC > 2 ? 'I' : 'C2',
        scores.MP > 2 ? 'M' : 'P'
    ];
    const founder_type = dominant_traits.join("");
    const clean_founder_type = founder_type.replace("C2", "C");
    const trait_descriptions = dominant_traits.map(t => dimension_descriptions[t]).join("<br><br>");
    const suggestion = cofounder_suggestions[clean_founder_type] || "Your profile is unique! Seek collaborators who complement your entrepreneurial style.";

    document.getElementById("testSection").style.display = "none";
    document.getElementById("resultSection").style.display = "block";
    document.getElementById("founderType").innerHTML = clean_founder_type;
    document.getElementById("profileDescription").innerHTML = `<h3>Profile Description:</h3>${trait_descriptions}<br><br><h3>Co-Founder Suggestions:</h3>${suggestion}`;

    // Send results to backend (added to fix Andrea's version)
    const founderName = document.getElementById("founderName").value;
    const startupName = document.getElementById("startupName").value;
    const email = document.getElementById("email").value;
    sendToBackend(founderName, startupName, email, clean_founder_type, trait_descriptions, suggestion);
}

function sendToBackend(founderName, startupName, email, founderType, traitDescriptions, suggestion) {
    const scriptURL = "https://founder-vfti-app-new.onrender.com/submit";
    const payload = { founderName, startupName, email, founderType, traitDescriptions, suggestion };
    fetch(scriptURL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        .then(response => response.json())
        .then(result => {
            if (result.result === "success") console.log("Data logged successfully:", result);
            else console.error("Error logging data:", result.error);
        })
        .catch(error => console.error("Error sending data:", error));
}
