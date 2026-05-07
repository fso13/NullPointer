interface IProps {
  value?: string;
  onChange?: (value: string) => void;
}

const Search: React.FC<IProps> = ({ value = '', onChange }) => (
  <nav className='search flex flex-h-center'>
    <div className='search-container'>
      <label
        htmlFor='search'
        className='material-symbols-outlined flex flex-gap-medium flex-h-center flex-v-center'
      >
        search
        <input
          type='text'
          id='search'
          name='search'
          maxLength={32}
          autoComplete='off'
          placeholder='Search songs, albums, artists...'
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      </label>
    </div>
  </nav>
);

export default Search;
