import { toPng } from "html-to-image";

export const exportToImage = async (element: HTMLElement): Promise<void> => {
  try {
    const clonedElement = element.cloneNode(true) as HTMLElement;

    Object.assign(clonedElement.style, {
      width: "1080px",
      height: "1920px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      padding: "25px",
      margin: "0",
    });

    const mobilitatWrappedTitle = clonedElement.querySelectorAll(
      "h2.title-wrapped"
    ) as NodeListOf<HTMLElement>;

    mobilitatWrappedTitle.forEach((el) => {
      Object.assign(el.style, {
        fontSize: "50px",
        width: "800px",
        height: "80px",
        padding: "10px",
        lineHeight: "1",
      });
    });

    const validationsContainer = clonedElement.querySelectorAll(
      "stat-card-validations"
    ) as NodeListOf<HTMLElement>;

    validationsContainer.forEach((el) => {
      Object.assign(el.style, {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
      });

      const textElementsValidationsContainer = clonedElement.querySelectorAll(
        "p"
      ) as NodeListOf<HTMLElement>;
      textElementsValidationsContainer.forEach((text) => {
        Object.assign(text.style, {
          display: "flex",
          textAlig: "center",
        });
      });
    });

    const topListStationsContainer = clonedElement.querySelectorAll(
      "stat-card-stations"
    ) as NodeListOf<HTMLElement>;

    topListStationsContainer.forEach((el) => {
      Object.assign(el.style, {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "40px",
        fontWeight: "bold",
      });
    });

    const textElementsTopListStations = element.querySelectorAll("span");
    textElementsTopListStations.forEach((text) => {
      Object.assign(text.style, {
        display: "block",
        textAlign: "center",
        lineHeight: "1.5",
        fontSize: "30px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        maxWidth: "600px",
      });

      const textTravels = element.querySelectorAll("p");
      textTravels.forEach((text) => {
        Object.assign(text.style, {
          display: "block",
          lineHeight: "1.2",
          fontSize: "30px",
        });
      });
    });

    const operadoresContainer = clonedElement.querySelectorAll(
      "stat-card-operadores"
    ) as NodeListOf<HTMLElement>;

    operadoresContainer.forEach((el) => {
      Object.assign(el.style, {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "40px",
        fontWeight: "bold",
      });

      const textElementsTopListOperadores = element.querySelectorAll("span");
      textElementsTopListOperadores.forEach((text) => {
        Object.assign(text.style, {
          display: "block",
          textAlign: "center",
          lineHeight: "1.5",
          fontSize: "30px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          maxWidth: "600px",
        });
      });
    });

    document.body.appendChild(clonedElement);

    const dataUrl = await toPng(clonedElement, {
      quality: 1,
      pixelRatio: 2,
    });

    document.body.removeChild(clonedElement);

    const link = document.createElement("a");
    link.download = "T-wrapped.png";
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("No s'ha pogut generar la imatge");
  }
};
