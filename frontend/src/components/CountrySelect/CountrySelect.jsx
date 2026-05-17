import React from 'react';
import './CountrySelect.css';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia',
  'Austria','Azerbaijan','Bahamas','Bahrain','Bangladesh','Belarus','Belgium','Belize',
  'Benin','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria',
  'Burkina Faso','Burundi','Cambodia','Cameroon','Canada','Cape Verde','Chile','China',
  'Colombia','Comoros','Congo','Costa Rica','Croatia','Cuba','Cyprus','Czech Republic',
  'Denmark','Djibouti','Dominican Republic','Ecuador','Egypt','El Salvador','Estonia',
  'Ethiopia','Fiji','Finland','France','Gabon','Gambia','Georgia','Germany','Ghana',
  'Greece','Guatemala','Guinea','Haiti','Honduras','Hungary','Iceland','India',
  'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kuwait','Kyrgyzstan','Laos','Latvia','Lebanon','Libya',
  'Lithuania','Luxembourg','Madagascar','Malawi','Malaysia','Maldives','Mali','Malta',
  'Mauritania','Mauritius','Mexico','Moldova','Monaco','Mongolia','Montenegro','Morocco',
  'Mozambique','Myanmar','Namibia','Nepal','Netherlands','New Zealand','Nicaragua',
  'Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Panama',
  'Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
  'Romania','Russia','Rwanda','Saudi Arabia','Senegal','Serbia','Sierra Leone',
  'Singapore','Slovakia','Slovenia','Somalia','South Africa','South Korea','Spain',
  'Sri Lanka','Sudan','Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania',
  'Thailand','Togo','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay',
  'Uzbekistan','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

function CountrySelect({ id, value, onChange, error = '', disabled = false, required = false }) {
  return (
    <div className={`country-select ${error ? 'country-select--error' : ''}`}>
      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className="country-select__field"
      >
        <option value="">Select country…</option>
        {COUNTRIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      {error && <span className="country-select__error">{error}</span>}
    </div>
  );
}

export default CountrySelect;
