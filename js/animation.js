function startAttackAnimation() {

    const packet =
        document.getElementById("packet");

    if (!packet) return;

    packet.classList.remove(
        "packet-move"
    );

    setTimeout(() => {

        packet.classList.add(
            "packet-move"
        );

    }, 50);
}