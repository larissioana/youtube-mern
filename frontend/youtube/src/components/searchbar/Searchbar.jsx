import './searchbar.scss';
import magnifier from '../../assets/magnifier.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { formattedString } from '../../utils/formatText';

const Searchbar = () => {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const handleClearQuery = () => {
        setQuery("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/search?q=${query}`);
    };

    return (
        <div className="searchbar">
            <form onSubmit={handleSubmit}>
                <input type="text" value={formattedString(query, 60)} placeholder='Search' onChange={(e) => setQuery(e.target.value)} />
                {query.length > 0 && <CloseIcon className="close-query" onClick={handleClearQuery} />}
                <img src={magnifier} alt="magnifier" width={20} height={20} onClick={() => navigate(`/ search ? q = ${(query)}`)} />
            </form>
        </div>
    )
};

export default Searchbar;
