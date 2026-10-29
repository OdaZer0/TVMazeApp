import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function HomeScreen({ navigation }) {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadShows() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.tvmaze.com/shows');
        if (!response.ok) {
          throw new Error(`Erro ao buscar séries (${response.status})`);
        }
        const data = await response.json();
        setShows(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Não foi possível carregar as séries.');
      } finally {
        setLoading(false);
      }
    }

    loadShows();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.statusText}>Carregando séries...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shows}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <Pressable
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => navigation.navigate('Details', { id: item.id, name: item.name })}
        >
          {item.image?.medium ? (
            <Image source={{ uri: item.image.medium }} style={styles.poster} />
          ) : (
            <View style={[styles.poster, styles.noImage]}>
              <Text style={styles.noImageText}>Sem imagem</Text>
            </View>
          )}
          <Text style={styles.showName} numberOfLines={2}>{item.name || 'Nome indisponível'}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  statusText: { marginTop: 12, color: '#4b5563' },
  errorText: { color: '#b91c1c', textAlign: 'center', fontSize: 16 },
  list: { padding: 12, backgroundColor: '#f3f4f6' },
  card: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12,
    marginBottom: 10, padding: 10, elevation: 2,
  },
  cardPressed: { opacity: 0.75 },
  poster: { width: 70, height: 98, borderRadius: 8, resizeMode: 'cover' },
  noImage: { backgroundColor: '#d1d5db', alignItems: 'center', justifyContent: 'center' },
  noImageText: { color: '#4b5563', fontSize: 12, textAlign: 'center' },
  showName: { flex: 1, marginLeft: 14, fontSize: 18, fontWeight: '700', color: '#111827' },
});