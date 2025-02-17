import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Toolbar from "../../components/features/dashboard/components/Toolbar";
import ArticleCard from "../../components/features/dashboard/components/ArticleCard";
import {
  getAArticles,
  deleteArticle,
  addFavourite,
  getMyArticles,
} from "../../redux/articleSlice";
import {
  showNotification,
  setPageTitle,
} from "../../components/features/common/headerSlice";

function MyArticle(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const value = useSelector((state) => state.article);
  useEffect(() => {
    dispatch(setPageTitle({ title: "My Article" }));
  }, [dispatch]);
  const setHandleAddArticle = () => {
    navigate(`/newArticle/${0}`);
  };
  const onFavouriteArticle = (index) => {
    dispatch(addFavourite({ id: index, from: user._id }));
  };
  const setHandleCommentArticle = (index) => {
    dispatch(getAArticles(index));
    navigate(`/answerArticle/${index}`);
  };
  const setHandleDelete = (index) => {
    if (window.confirm("Are you delete this Article?")) {
      dispatch(deleteArticle(index));
    }
  };
  const setHandleEdit = (index) => {
    dispatch(getAArticles(index));
    navigate(`/newArticle/${index}`);
  };
  useEffect(() => {
    dispatch(getMyArticles({ from: props.id || user._id }));
    if (value.isLoading)
      dispatch(showNotification({ message: value.message, status: 1 }));
  }, [dispatch, props.id, user._id, value.isLoading, value.message]);

  return (
    <>
      <Toolbar onAddClick={setHandleAddArticle} />
      {value.articles.length ? (
        value.articles.map((v, i) => {
          return (
            <div key={i}>
              <ArticleCard
                type={"myarticle"}
                title={v.title}
                avatar={v.from.avatar}
                favouriteNum={v.favorite.length}
                content={v.content}
                date={v.createdAt}
                from={v.from.name}
                onFavouriteClick={() => {
                  onFavouriteArticle(v._id);
                }}
                onDeleteArticle={() => {
                  setHandleDelete(v._id);
                }}
                onEditArticle={() => {
                  setHandleEdit(v._id);
                }}
                onCommentClick={() => {
                  setHandleCommentArticle(v._id);
                }}
              />
            </div>
          );
        })
      ) : (
        <div className="text-[50px] text-red-500">No Data</div>
      )}
    </>
  );
}

export default MyArticle;
