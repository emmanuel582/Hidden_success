import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Platform } from 'react-native';
import { Colors } from '@/constants/Colors';

interface Suggestion {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface OpenStreetMapAutocompleteProps {
    placeholder?: string;
    value?: string;
    onSelect: (place: Suggestion) => void;
    onChangeText?: (text: string) => void;
    containerStyle?: object;
    inputStyle?: object;
}

export default function OpenStreetMapAutocomplete({
    placeholder = 'Search location...',
    value: initialValue = '',
    onSelect,
    onChangeText,
    containerStyle,
    inputStyle,
}: OpenStreetMapAutocompleteProps) {
    const [query, setQuery] = useState(initialValue);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    const [debounceTimer, setDebounceTimer] = useState<any>(null);

    useEffect(() => {
        return () => {
            if (debounceTimer) clearTimeout(debounceTimer);
        };
    }, [debounceTimer]);

    const searchPlaces = (text: string) => {
        setQuery(text);
        if (onChangeText) {
            onChangeText(text);
        }

        if (debounceTimer) clearTimeout(debounceTimer);

        if (text.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                // Use Nominatim OpenStreetMap API
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(text)}&addressdetails=1&limit=5`,
                    {
                        headers: {
                            'User-Agent': 'MoveVerApp/1.0 (movever@example.com)', // Added contact info as per policy
                        },
                    }
                );
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setSuggestions(data);
                setShowSuggestions(true);
            } catch (error) {
                console.error('Error fetching places:', error);
            } finally {
                setLoading(false);
            }
        }, 800); // 800ms debounce
        setDebounceTimer(timer);
    };

    const handleSelect = (item: Suggestion) => {
        setQuery(item.display_name);
        setShowSuggestions(false);
        onSelect(item);
        if (onChangeText) {
            onChangeText(item.display_name);
        }
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, inputStyle]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textSecondary}
                    value={query}
                    onChangeText={searchPlaces}
                    onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                />
                {loading && <ActivityIndicator style={styles.loader} color={Colors.primary} />}
            </View>

            {showSuggestions && suggestions.length > 0 && (
                <View style={styles.suggestionsList}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item.place_id.toString()}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.suggestionItem}
                                onPress={() => handleSelect(item)}
                            >
                                <Text style={styles.suggestionText} numberOfLines={2}>
                                    {item.display_name}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
        position: 'relative',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: Colors.text,
    },
    loader: {
        marginRight: 12,
    },
    suggestionsList: {
        position: 'absolute',
        top: 54, // Height of input + margin
        left: 0,
        right: 0,
        backgroundColor: Colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        maxHeight: 200,
        zIndex: 1000,
        ...(Platform.OS !== 'web' ? {
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        } : {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        } as any),
    },
    suggestionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    suggestionText: {
        fontSize: 14,
        color: Colors.text,
    },
});
