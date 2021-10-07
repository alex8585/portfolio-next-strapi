import React, { useEffect, useState } from "react"

import Button from "@material-ui/core/Button"
import Card from "@material-ui/core/Card"

import CardContent from "@material-ui/core/CardContent"
import CardHeader from "@material-ui/core/CardHeader"
import Grid from "@material-ui/core/Grid"

import Typography from "@material-ui/core/Typography"

import { makeStyles } from "@material-ui/styles"
import Container from "@material-ui/core/Container"

import { useDispatch, useSelector } from "react-redux"

import Pagination from "@material-ui/core/Pagination"

import { red } from "@material-ui/core/colors"

import Chip from "@material-ui/core/Chip"
import Paper from "@material-ui/core/Paper"
import { wrapper } from "../store"
//import Tag from "../models/tagModel.js"

//import Portfolio from "../models/portfolioModel.js"
import { tagsSelectors, getTags } from "../features/tags/tagsSlice"
import {
  portfoliosSelectors,
  getPortfolios,
} from "../features/portfolios/portfoliosSlice"
import { calcPages } from "../utils/utils.js"
import Image from "next/image"
import FrontendLayout from "../components/FrontendLayout"
import Head from "next/head"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"
import { getImgUrl } from "../utils/utils"
const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },
  link: {
    margin: "5px 0px",
  },
  heroContent: {
    padding: "20px 0px 5px",
    maxWidth: "960px",
    "& li div": { backgroundColor: "#e0e0e0" },
  },
  cardHeader: {
    backgroundColor: "#e0e0e0",
    marginBottom: "10px",
  },
  cardPricing: (props) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: "15px",
  }),

  chip: (props) => ({
    margin: "0px 5px",
  }),
  card: {
    margin: "0 auto",
    maxWidth: 345,
  },
  paper: (props) => ({
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    listStyle: "none",
    padding: "7px 10px",
    marginBottom: 12,
    "& .active .MuiButtonBase-root": {
      backgroundColor: "rgb(144, 131, 112)",
    },
  }),
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: (props) => ({
    transform: "rotate(0deg)",
    marginLeft: "auto",
  }),
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
  image: {
    cursor: "pointer",
  },
  button: {
    marginTop: "15px",
    width: "100%",
    textAlign: "center",
  },
  paginatorContainer: {
    display: "flex",
    marginTop: 10,
  },
  pagination: {
    margin: "0 auto",
    "& ul": {
      listStyle: "none",
      padding: 0,
      margin: 0,
      display: "flex",
    },
  },
}))

const perPage = 6

const Index = ({ match, location, history, staticTags }) => {
  const classes = useStyles()

  const dispatch = useDispatch()

  // const { data, page, total, loading } = useSelector(
  //   (state) => state.portfolioList
  // )
  // const { data: tags, loading: tagsloading } = useSelector(
  //   (state) => state.tagList
  // )

  const { loading } = useSelector((state) => state.tags)
  const portfoliosLoading = useSelector((state) => state.portfolios.loading)
  const page = useSelector((state) => state.portfolios.page)

  const tags = useSelector(tagsSelectors.selectAll)
  const portfolios = useSelector(portfoliosSelectors.selectAll)
  const total = useSelector((state) => state.portfolios.total)
  let countPages = calcPages(perPage, total)

  const images = []
  //  useEffect(async () => {
  //dispatch(listTags(1))

  //  }, [dispatch])

  // useEffect(() => {
  //   if(!tags.length) return
  //   dispatch(listPortfolios(1, 6, tags))
  // }, [dispatch, tags])

  const [isOpen, setIsOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)
  const [tagFilter, setTagFilter] = useState([])

  let setCurrentImage = (index) => {
    setPhotoIndex(index)
    setIsOpen(true)
  }

  let handletagFilter = async (id) => {
    let tmpTagFilter = [...tagFilter]
    var index = tmpTagFilter.indexOf(id)
    if (index !== -1) {
      tmpTagFilter.splice(index, 1)
    } else {
      tmpTagFilter.push(id)
    }

    setTagFilter(tmpTagFilter)

    dispatch(getPortfolios({ page: 1, perPage, tags: tmpTagFilter }))
  }

  let handleChangePage = (event, value) => {
    dispatch(getPortfolios({ page: value, perPage, tags: tagFilter }))
  }

  let pushImage = (img) => {
    if (img && img.url) {
      images.push(getImgUrl(img.url))
    }
  }

  if (portfoliosLoading) return "loading..."
  return (
    <FrontendLayout>
      <Head>
        <title>Portfolio</title>
        <meta name="description" content="Welcome to alex85 portfolio page" />
      </Head>

      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Portfolio
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        ></Typography>
      </Container>
      <Container maxWidth="md" component="main" className={classes.heroContent}>
        <ul className={classes.paper}>
          {[...tags]
            //.sort((a, b) => (a.order_number > b.order_number ? 1 : -1))
            .map((tag) => {
              return (
                <li
                  key={tag.id}
                  className={tagFilter.includes(tag.id) ? "active" : ""}
                >
                  <Chip
                    label={tag.name}
                    onClick={() => handletagFilter(tag.id)}
                    className={classes.chip}
                  />
                </li>
              )
            })}
        </ul>
        <Grid container spacing={5} alignItems="flex-end">
          {portfolios.map((portfolio, i) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={portfolio.name} xs={12} sm={6} md={4}>
              <Card className={classes.card}>
                <CardHeader
                  title={portfolio.name}
                  subheader=""
                  className={classes.cardHeader}
                />
                {pushImage(portfolio.image)}
                <img
                  className={classes.image}
                  onClick={() => setCurrentImage(i)}
                  src={portfolio.image ? getImgUrl(portfolio.image.url) : ""}
                  alt={portfolio.name}
                  width={300}
                  height={200}
                />
                <CardContent>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                  >
                    {portfolio.description ? portfolio.description : ""}
                  </Typography>
                  <Paper component="ul" className={classes.paper}>
                    {[...portfolio.tags]
                      // .sort((a, b) =>
                      //  a.order_number > b.order_number ? 1 : -1
                      //)
                      .map((tag) => {
                        return (
                          <li key={tag.id}>
                            <Chip label={tag.name} className={classes.chip} />
                          </li>
                        )
                      })}
                  </Paper>
                  {portfolio.url.indexOf("github") !== -1 && (
                    <Button
                      target="_blank"
                      className={classes.button}
                      variant="contained"
                      color="secondary"
                      href={portfolio.url}
                    >
                      Github
                    </Button>
                  )}
                  {portfolio.url.indexOf("github") === -1 && (
                    <Button
                      target="_blank"
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      href={portfolio.url}
                    >
                      View
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div className={classes.paginatorContainer}>
          <Pagination
            page={parseInt(page)}
            count={parseInt(countPages)}
            onChange={handleChangePage}
            className={classes.pagination}
          />
        </div>
      </Container>
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </FrontendLayout>
  )
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ preview }) => {
      await store.dispatch(getTags())
      await store.dispatch(getPortfolios({ page: 1, perPage }))
      return { revalidate: 1 }
    }
)

export default Index
