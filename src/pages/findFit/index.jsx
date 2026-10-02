import "./FindFitPage.css";

const fitOptions = [
  {
    id: "01",
    title: "Men",
    description: "Find your perfect shirt and trouser size.",
    image: "/images/men-fit.png",
    link: "/mens-fit",
    imageClass: "men-image",
  },
  {
    id: "02",
    title: "Women",
    description:
      "Find your perfect clothing size using your measurements.",
    image: "/images/women-fit.png",
    link: "/womens-fit",
    imageClass: "women-image",
  },
];

const FindFitPage = () => {
  return (
    <main className="fit-selection">
      <div className="fit-selection-content">
        {/* PAGE HEADER */}
        <div className="fit-header">
          <span className="fit-eyebrow">AVIT FIT GUIDE</span>

          <h1>Find Your Perfect Fit</h1>

          <p className="fit-intro">
            Tell us a little about yourself and we'll recommend
            the best size for you.
          </p>
        </div>

        {/* GENDER SELECTION */}
        <div className="gender-selection">
          {fitOptions.map((option) => (
            <a
              href={option.link}
              className="gender-card"
              key={option.id}
            >
              <div
                className={`gender-image ${option.imageClass}`}
                style={{
                  backgroundImage: `linear-gradient(
                    to bottom,
                    transparent,
                    rgba(9, 13, 18, 0.8)
                  ), url("${option.image}")`,
                }}
                role="img"
                aria-label={`${option.title}'s fashion`}
              />

              <div className="gender-info">
                <span>{option.id}</span>

                <h2>{option.title}</h2>

                <p>{option.description}</p>

                <div className="continue-link">
                  Continue
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
};

export default FindFitPage;