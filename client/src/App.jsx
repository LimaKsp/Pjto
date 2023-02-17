import { Table, Container, Button } from "react-bootstrap";
import ContentsApi from "./api/ContentsApi";
import { useEffect, useState } from "react";
import CreateContentModal from "./components/CreateContentModal";
import UpdateContentModal from "./components/UpdateContentModal";

function App() {
  const [contents, setContents] = useState();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState();

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleShowCreateModal = () => setIsCreateModalOpen(true);

  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);
  const handleShowUpdateModal = () => setIsUpdateModalOpen(true);

  useEffect(() => {
    async function getData() {
      await ContentsApi()
        .getContents()
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          setContents(data);
        });
    }

    getData();
  }, []);

  async function deleteContent(contentId) {
    try {
      await ContentsApi().deleteContent(contentId);

      const formattedContents = contents.filter((cont) => {
        if (cont.id !== contentId) {
          return cont;
        }
      });

      setContents(formattedContents);
    } catch (err) {
      throw err;
    }
  }

  async function createContent(event) {
    try {
      event.preventDefault();

      const req = event.currentTarget.elements;

      await ContentsApi()
        .createContent(
          req.titulo.value,
          req.descricao.value,
          Number(req.porcentagem.value),
          Number(req.paginas.value)
        )
        .then((data) => {
          return data.json();
        })
        .then((res) => {
          setContents([
            ...contents,
            {
              id: res.contentId,
              titulo: req.titulo.value,
              descricao: req.descricao.value,
              porcentagem: Number(req.porcentagem.value),
              paginas: Number(req.paginas.value),
            },
          ]);

          setIsCreateModalOpen(false);
        });
    } catch (err) {
      throw err;
    }
  }

  async function updateContent(event) {
    try {
      event.preventDefault();

      const req = event.currentTarget.elements;

      await ContentsApi().updateContent(
        selectedContent.id,
        req.titulo.value,
        req.descricao.value,
        Number(req.porcentagem.value),
        Number(req.paginas.value)
      );

      const formattedContents = contents.map((cont) => {
        if (cont.id === selectedContent.id) {
          return {
            id: selectedContent.id,
            titulo: req.titulo.value,
            descricao: req.descricao.value,
            porcentagem: Number(req.porcentagem.value),
            paginas: Number(req.paginas.value),
          };
        }

        return cont;
      });

      setContents(formattedContents);

      setIsUpdateModalOpen(false);
    } catch (err) {
      throw err;
    }
  }

  return (
    <>
      <Container
        className="
        d-flex
        flex-column
        align-items-start
        justify-content-center
        h-100
        w-100
        "
      >
        <div
          className="
        d-flex
        flex-column
        align-items-center
        justify-content-center
        h-50
        w-100
        "
        >
          <h1> Controle Leitura 2023: </h1>
        </div>
        <Button
          className="mb-2"
          onClick={handleShowCreateModal}
          variant="primary"
        >
          Adicionar Livro
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Tema</th>
              <th>Páginas Lidas</th>
              <th>Total de Páginas</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {contents &&
              contents.map((cont) => (
                <tr key={cont.id}>
                  <td>{cont.titulo}</td>
                  <td>{cont.descricao}</td>
                  <td>{cont.porcentagem}</td>
                  <td>{cont.paginas}</td>
                  <td>
                    <Button
                      onClick={() => deleteContent(cont.id)}
                      variant="danger"
                    >
                      Excluir
                    </Button>
                    <Button
                      onClick={() => {
                        handleShowUpdateModal();
                        setSelectedContent(cont);
                      }}
                      variant="warning"
                      className="m-1"
                    >
                      Atualizar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
      <CreateContentModal
        isModalOpen={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        createContent={createContent}
      />
      {selectedContent && (
        <UpdateContentModal
          isModalOpen={isUpdateModalOpen}
          handleClose={handleCloseUpdateModal}
          updateContent={updateContent}
          content={selectedContent}
        />
      )}
    </>
  );
}

export default App;