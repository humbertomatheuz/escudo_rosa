import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../contexts/UserContext';
import { registerUser, loginUser } from '../../services/users';
import { listarDenuncias, Denuncia } from '../../services/denuncias';
import styles from '@/styles/styles';

const options = [
  {
    label: 'Privacidade e Segurança',
    icon: 'lock-closed-outline',
    key: 'privacidade',
  },
];

type DenunciaModalItem = Denuncia | null;

const PerfilScreen = () => {
  const { user, setUser } = useUser();

  const [loginVisible, setLoginVisible] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [loginError, setLoginError] = useState('');

  const [logoutVisible, setLogoutVisible] = useState(false);

  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);

  const [denuncias, setDenuncias] = useState<Denuncia[]>([]);
  const [loadingDenuncias, setLoadingDenuncias] = useState(false);
  const [denunciasExpanded, setDenunciasExpanded] = useState(false);
  const [denunciaModalVisible, setDenunciaModalVisible] = useState(false);
  const [selectedDenuncia, setSelectedDenuncia] = useState<DenunciaModalItem>(null);

  const [isGestor, setIsGestor] = useState(false);

  useEffect(() => {
    if (user && user.cargo === 'admin') {
      setIsGestor(true);
    } else {
      setIsGestor(false);
    }
  }, [user]);

  // Função para carregar as denúncias
  const fetchDenuncias = useCallback(async () => {
    if (!user || user.cargo !== 'admin' || loadingDenuncias) {
      return; // Apenas gestores podem carregar e evita múltiplas chamadas
    }

    setLoadingDenuncias(true);
    try {
      const fetchedDenuncias = await listarDenuncias();
      setDenuncias(fetchedDenuncias);
    } catch (error) {
      console.error('Erro ao carregar denúncias:', error);
      Alert.alert('Erro', 'Não foi possível carregar as denúncias.');
    } finally {
      setLoadingDenuncias(false);
    }
  }, [user, loadingDenuncias]); // Dependências do useCallback: user e loadingDenuncias

  // useEffect para carregar denúncias quando a seção é expandida e é gestor
  // e ainda não há denúncias carregadas.
  useEffect(() => {
    if (isGestor && denunciasExpanded && denuncias.length === 0) {
      fetchDenuncias();
    }
  }, [isGestor, denunciasExpanded, denuncias.length, fetchDenuncias]); // Adicione fetchDenuncias como dependência

  const handleLogin = async () => {
    try {
      const userDb = await loginUser(login, senha);
      if (userDb) {
        setUser({
          name: userDb.name,
          username: userDb.username,
          cargo: userDb.cargo,
        });
        setIsGestor(userDb.cargo === 'admin');
        setLogin('');
        setSenha('');
        setNome('');
        setLoginError('');
        setLoginVisible(false); // Fechar modal após login
      } else {
        setLoginError('Usuário ou senha inválidos');
      }
    } catch (e) {
      setLoginError('Erro ao acessar o banco');
    }
  };

  const handleRegister = async () => {
    if (!login || !senha || !nome) {
      setLoginError('Preencha todos os campos');
      return;
    }
    try {
      await registerUser({
        username: login,
        password: senha,
        name: nome,
        cargo: 'user',
      });
      setLoginError('Cadastro realizado! Faça login.');
      setIsRegister(false);
    } catch (e) {
      setLoginError('Erro ao cadastrar. Usuário já existe?');
    }
  };

  const openDenunciaModal = (denuncia: Denuncia) => {
    setSelectedDenuncia(denuncia);
    setDenunciaModalVisible(true);
  };

  const closeDenunciaModal = () => {
    setDenunciaModalVisible(false);
    setSelectedDenuncia(null);
  };

  const renderDenunciaCard = ({ item, index }: { item: Denuncia; index: number }) => (
    <TouchableOpacity
      style={[styles.itemCard, index === denuncias.length - 1 && styles.lastItemCard]}
      onPress={() => openDenunciaModal(item)}
    >
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>Motivo: {item.motivo}</Text>
        {item.nome && <Text style={styles.itemLocation}>Denunciante: {item.nome}</Text>}
        {!item.identificar && <Text style={styles.itemLocation}>(Anônimo)</Text>}
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="#CFCFD1" style={styles.itemArrow} />
    </TouchableOpacity>
  );

  if (!user) {
    return (
      <View style={styles.containerPerfil}>
        <Text style={styles.header}>Configurações</Text>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={64} color="#fff" />
          </View>
          <Text style={styles.name}>Desconectado</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.options}>
          <TouchableOpacity style={styles.optionRow} onPress={() => setPrivacyModalVisible(true)}>
            <Text style={styles.optionText}>Privacidade e Segurança</Text>
            <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => {
            setLoginVisible(true);
            setIsRegister(false);
            setLoginError('');
          }}
        >
          <Text style={styles.loginButtonText}>Conectar ou registrar-se</Text>
        </TouchableOpacity>

        {/* Modal de Login/Cadastro (EXISTENTE) */}
        <Modal
          visible={loginVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setLoginVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isRegister ? 'Cadastrar' : 'Entrar'}</Text>
              {isRegister && (
                <TextInput
                  style={styles.input}
                  placeholder="Nome"
                  value={nome}
                  onChangeText={setNome}
                />
              )}
              <TextInput
                placeholderTextColor={'#888'}
                style={styles.input}
                placeholder="Usuário"
                autoCapitalize="none"
                value={login}
                onChangeText={setLogin}
              />
              <TextInput
                placeholderTextColor={'#888'}
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
              />
              {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: '#fff', borderWidth: 2, borderColor: '#A03A5E' },
                  ]}
                  onPress={() => {
                    setLoginVisible(false);
                    setLogin('');
                    setSenha('');
                    setNome('');
                    setLoginError('');
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: '#A03A5E' }]}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#A03A5E' }]}
                  onPress={isRegister ? handleRegister : handleLogin}
                >
                  <Text style={styles.modalButtonText}>{isRegister ? 'Cadastrar' : 'Entrar'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{ marginTop: 16, alignSelf: 'center' }}
                onPress={() => {
                  setIsRegister(!isRegister);
                  setLoginError('');
                }}
              >
                <Text style={{ color: '#A03A5E', fontWeight: 'bold' }}>
                  {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Cadastre-se'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          visible={privacyModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setPrivacyModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.privacyModalContent}>
              <Text style={styles.modalTitle}>Privacidade e Segurança</Text>
              <Text style={styles.privacyText}>
                Nós levamos a sua privacidade a sério. Aqui estão algumas informações importantes
                sobre como seus dados são tratados:
              </Text>
              <Text style={styles.privacyText}>
                - **Coleta de Dados:** Coletamos apenas os dados essenciais para o funcionamento do
                aplicativo, como seu nome de usuário e informações de login.
              </Text>
              <Text style={styles.privacyText}>
                - **Uso dos Dados:** Seus dados são usados exclusivamente para personalizar sua
                experiência e garantir a segurança da sua conta. Nunca compartilhamos seus dados com
                terceiros sem seu consentimento explícito.
              </Text>
              <Text style={styles.privacyText}>
                - **Segurança:** Empregamos medidas de segurança avançadas para proteger suas
                informações contra acessos não autorizados. Suas senhas são armazenadas de forma
                criptografada.
              </Text>
              <Text style={styles.privacyText}>
                - **Controle:** Você tem total controle sobre suas informações. Acesse as
                configurações da sua conta para gerenciar suas preferências de privacidade.
              </Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setPrivacyModalVisible(false)}
              >
                <Text style={styles.closeModalButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.containerPerfil}>
      <Text style={styles.header}>Configurações</Text>
      <View style={styles.avatarContainer}>
        <View style={[styles.avatar, { backgroundColor: '#C4C4C4' }]}>
          <Ionicons name="person" size={64} color="#fff" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.options}>
        {options.map((option) => (
          <TouchableOpacity
            style={styles.optionRow}
            key={option.key}
            onPress={() => {
              if (option.key === 'privacidade') {
                setPrivacyModalVisible(true);
              }
            }}
          >
            <Text style={styles.optionText}>{option.label}</Text>
            <Ionicons name="chevron-forward" size={20} color="#B0B0B0" />
          </TouchableOpacity>
        ))}

        {isGestor && (
          <View>
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => {
                const newState = !denunciasExpanded;
                setDenunciasExpanded(newState);
                // Se expandir, força o carregamento das denúncias
                if (newState) {
                  fetchDenuncias();
                } else {
                  // Opcional: Se recolher, você pode limpar a lista para forçar um novo carregamento na próxima vez
                  setDenuncias([]);
                }
              }}
            >
              <Text style={styles.optionText}>Denúncias</Text>
              <Ionicons
                name={denunciasExpanded ? 'chevron-down' : 'chevron-forward'}
                size={20}
                color="#B0B0B0"
              />
            </TouchableOpacity>

            {denunciasExpanded && (
              <View style={styles.denunciasListContainer}>
                {loadingDenuncias ? (
                  <ActivityIndicator size="small" color="#A03A5E" style={{ marginVertical: 10 }} />
                ) : denuncias.length > 0 ? (
                  <FlatList
                    data={denuncias}
                    renderItem={renderDenunciaCard}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    scrollEnabled={false}
                  />
                ) : (
                  <Text style={styles.noDenunciasText}>Nenhuma denúncia encontrada.</Text>
                )}
              </View>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.optionRow} onPress={() => setLogoutVisible(true)}>
          <Text style={styles.optionText}>Desconectar</Text>
          <Ionicons name="exit-outline" size={20} color="#B0B0B0" />
        </TouchableOpacity>
      </View>

      {/* Modal de Desconectar (EXISTENTE) */}
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
              Tem certeza de que deseja sair? Você precisará fazer login novamente para usar o
              aplicativo.
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
                  setIsGestor(false);
                  setDenuncias([]); // Limpa as denúncias ao desconectar
                  setDenunciasExpanded(false); // Fecha a seção de denúncias
                }}
              >
                <Text style={styles.modalButtonText}>Desconectar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Privacidade e Segurança (EXISTENTE) */}
      <Modal
        visible={privacyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPrivacyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.privacyModalContent}>
            <Text style={styles.modalTitle}>Privacidade e Segurança</Text>
            <Text style={styles.privacyText}>
              Nós levamos a sua privacidade a sério. Aqui estão algumas informações importantes
              sobre como seus dados são tratados:
            </Text>
            <Text style={styles.privacyText}>
              - **Coleta de Dados:** Coletamos apenas os dados essenciais para o funcionamento do
              aplicativo, como seu nome de usuário e informações de login.
            </Text>
            <Text style={styles.privacyText}>
              - **Uso dos Dados:** Seus dados são usados exclusivamente para personalizar sua
              experiência e garantir a segurança da sua conta. Nunca compartilhamos seus dados com
              terceiros sem seu consentimento explícito.
            </Text>
            <Text style={styles.privacyText}>
              - **Segurança:** Empregamos medidas de segurança avançadas para proteger suas
              informações contra acessos não autorizados. Suas senhas são armazenadas de forma
              criptografada.
            </Text>
            <Text style={styles.privacyText}>
              - **Controle:** Você tem total controle sobre suas informações. Acesse as
              configurações da sua conta para gerenciar suas preferências de privacidade.
            </Text>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setPrivacyModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* NOVO MODAL: Detalhes da Denúncia */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={denunciaModalVisible}
        onRequestClose={closeDenunciaModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedDenuncia ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>Detalhes da Denúncia</Text>
                <Text style={styles.modalLabel}>Motivo:</Text>
                <Text style={styles.modalText}>{selectedDenuncia.motivo}</Text>

                <Text style={styles.modalLabel}>Descrição:</Text>
                <Text style={styles.modalText}>{selectedDenuncia.descricao}</Text>

                <Text style={styles.modalLabel}>Agressor:</Text>
                <Text style={styles.modalText}>{selectedDenuncia.agressor || 'Não informado'}</Text>

                <Text style={styles.modalLabel}>Identificação:</Text>
                <Text style={styles.modalText}>
                  {selectedDenuncia.identificar
                    ? selectedDenuncia.nome || 'Identificado'
                    : 'Anônimo'}
                </Text>
                {selectedDenuncia.identificar && selectedDenuncia.nome && (
                  <Text style={styles.modalTextDetail}>(Nome: {selectedDenuncia.nome})</Text>
                )}

                <Text style={styles.modalLabel}>Data da Denúncia:</Text>
                <Text style={styles.modalText}>
                  {new Date(selectedDenuncia.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              </ScrollView>
            ) : (
              <Text>Nenhuma denúncia selecionada.</Text>
            )}
            <TouchableOpacity style={styles.closeModalButton} onPress={closeDenunciaModal}>
              <Text style={styles.closeModalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PerfilScreen;