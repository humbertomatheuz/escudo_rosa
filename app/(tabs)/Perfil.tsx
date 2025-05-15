import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';

const options = [
  {
    label: 'Privacidade e Segurança',
    icon: 'lock-closed-outline',
    key: 'privacidade',
  },
];

const PerfilScreen = () => {
  const { user, setUser } = useUser();

  // Estados para modal de login
  const [loginVisible, setLoginVisible] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [loginError, setLoginError] = useState('');

  // Estado para modal de desconectar
  const [logoutVisible, setLogoutVisible] = useState(false);

  // Função de login
  const handleLogin = () => {
    if (login === 'admin' && senha === 'admin') {
      setUser({
        name: 'Humberto',
        username: '@humbertomatheus',
        avatarColor: '#C96A8C',
      });
      setLoginVisible(false);
      setLogin('');
      setSenha('');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha inválidos');
    }
  };

  // Tela para usuário deslogado
  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Configurações</Text>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={64} color="#fff" />
          </View>
          <Text style={styles.name}>Desconectado</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionRow}>
            <Text style={styles.optionText}>Privacidade e Segurança</Text>
            <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => setLoginVisible(true)}
        >
          <Text style={styles.loginButtonText}>Conectar ou registrar-se</Text>
        </TouchableOpacity>

        {/* Modal de Login */}
        <Modal
          visible={loginVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLoginVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Entrar</Text>
              <TextInput
                style={styles.input}
                placeholder="Usuário"
                autoCapitalize="none"
                value={login}
                onChangeText={setLogin}
              />
              <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#fff', borderWidth: 2, borderColor: '#A03A5E' }]}
                  onPress={() => {
                    setLoginVisible(false);
                    setLogin('');
                    setSenha('');
                    setLoginError('');
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: '#A03A5E' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#A03A5E' }]}
                  onPress={handleLogin}
                >
                  <Text style={styles.modalButtonText}>Entrar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Tela para usuário logado
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Configurações</Text>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
          <Ionicons name="person" size={64} color="#fff" />
          <TouchableOpacity style={styles.editIcon}>
            <MaterialIcons name="edit" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity style={styles.optionRow} key={option.key}>
            <Text style={styles.optionText}>{option.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.optionRow}
          onPress={() => setLogoutVisible(true)}
        >
          <Text style={styles.optionText}>Desconectar</Text>
          <Ionicons name="exit-outline" size={20} color="#B0B0B0" />
        </TouchableOpacity>
      </View>

      {/* Modal de Desconectar */}
      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.logoutModalContent}>
            <Text style={styles.logoutTitle}>Desconectar</Text>
            <Text style={styles.logoutText}>
              Tem certeza de que deseja sair? Você precisará fazer login novamente para usar o aplicativo.
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setLogoutVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: '#A03A5E' }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#A03A5E' }]}
                onPress={() => {
                  setUser(null);
                  setLogoutVisible(false);
                }}
              >
                <Text style={styles.modalButtonText}>Desconectar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#C96A8C',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  editIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#A03A5E',
    borderRadius: 12,
    padding: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  username: {
    fontSize: 15,
    color: '#888',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginHorizontal: 24,
    marginVertical: 16,
  },
  options: {
    marginHorizontal: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
  },
  optionText: {
    fontSize: 16,
    color: '#222',
  },
  loginButton: {
    marginTop: 32,
    marginHorizontal: 24,
    backgroundColor: '#A03A5E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: 320,
    alignItems: 'stretch',
    elevation: 6,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
  },
  errorText: {
    color: '#A03A5E',
    fontSize: 14,
    marginBottom: 4,
    alignSelf: 'center',
  },
  modalButton: {
    flex: 1,
    borderRadius: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoutModalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    width: 360,
    alignItems: 'stretch',
    elevation: 6,
  },
  logoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 8,
  },
  logoutText: {
    fontSize: 18,
    color: '#7A7A7A',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#A03A5E',
  },
});

export default PerfilScreen;