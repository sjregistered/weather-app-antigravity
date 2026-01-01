/**
 * CountryDropdown - Country selection with search
 * Stateless component - receives data and handlers via props
 */

import { useState, useRef, useEffect } from 'react';
import type { Country } from '../models/location.model';

interface CountryDropdownProps {
    countries: Country[];
    selectedCountry: Country | null;
    onCountrySelect: (country: Country) => void;
}

export function CountryDropdown({ countries, selectedCountry, onCountrySelect }: CountryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter countries by search term
    const filteredCountries = countries.filter(
        (country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.capital.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (country: Country) => {
        onCountrySelect(country);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="country-dropdown" ref={dropdownRef}>
            <button
                className="country-dropdown__trigger"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span>
                    {selectedCountry ? `${selectedCountry.name}` : 'Select a country'}
                </span>
                <span className={`country-dropdown__arrow ${isOpen ? 'country-dropdown__arrow--open' : ''}`}>
                    ▼
                </span>
            </button>

            {isOpen && (
                <div className="country-dropdown__menu" role="listbox">
                    <div className="country-dropdown__search">
                        <input
                            type="text"
                            placeholder="Search countries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <div className="country-dropdown__list">
                        {filteredCountries.length === 0 ? (
                            <div className="country-dropdown__option">No countries found</div>
                        ) : (
                            filteredCountries.map((country) => (
                                <div
                                    key={country.code}
                                    className={`country-dropdown__option ${selectedCountry?.code === country.code
                                            ? 'country-dropdown__option--selected'
                                            : ''
                                        }`}
                                    onClick={() => handleSelect(country)}
                                    role="option"
                                    aria-selected={selectedCountry?.code === country.code}
                                >
                                    <span className="country-dropdown__option-name">{country.name}</span>
                                    <span className="country-dropdown__option-capital">{country.capital}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
