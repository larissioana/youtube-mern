import './categories.scss';

const Categories = ({ selectedCategory, setSelectedCategory }) => {


    const handleCategories = (category) => {
        setSelectedCategory(category)
    };

    const getButtonStyle = (category) => {
        return {
            color: selectedCategory === category ? "var(--bg)" : "var(--fontColor)",
            backgroundColor: selectedCategory === category ? "var(--fontColor)" : "var(--bg)",
        }
    };

    return (
        <div className="categories-container">
            <button
                onClick={() => handleCategories("all")}
                style={getButtonStyle("all")}
            >
                All
            </button>
            <button
                style={getButtonStyle("coding")}
                onClick={() => handleCategories("coding")}
            >
                Coding
            </button>
            <button
                style={getButtonStyle("fashion")}
                onClick={() => handleCategories("fashion")}
            >
                Fashion
            </button>
            <button
                style={getButtonStyle("music")}
                onClick={() => handleCategories("music")}
            >
                Music
            </button>
            <button
                style={getButtonStyle("sports")}
                onClick={() => handleCategories("sports")}
            >
                Sports
            </button>
            <button
                style={getButtonStyle("movies")}
                onClick={() => handleCategories("movies")}
            >
                Movies
            </button>
            <button
                style={getButtonStyle("science")}
                onClick={() => handleCategories("science")}
            >
                Science
            </button>
        </div >
    )
};

export default Categories;
