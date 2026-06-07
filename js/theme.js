document.addEventListener("DOMContentLoaded", () => {

    const themeBtn =
        document.getElementById("themeToggle");

    const savedTheme =
        localStorage.getItem("theme");

    if(savedTheme === "light"){

        document.body.classList.add(
            "light-mode"
        );

        if(themeBtn){
            themeBtn.textContent =
                "☀️ Light";
        }
    }

    if(themeBtn){

        themeBtn.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-mode"
                );

                const isLight =
                    document.body.classList.contains(
                        "light-mode"
                    );

                localStorage.setItem(
                    "theme",
                    isLight
                        ? "light"
                        : "dark"
                );

                themeBtn.textContent =
                    isLight
                    ? "☀️ Light"
                    : "🌙 Dark";
            }
        );
    }
});