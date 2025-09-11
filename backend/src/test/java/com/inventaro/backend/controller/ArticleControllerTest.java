package com.inventaro.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inventaro.backend.dto.CreateArticleRequest;
import com.inventaro.backend.model.Article;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Transactional
@AutoConfigureMockMvc
class ArticleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createArticle_success() throws Exception {
        CreateArticleRequest request = new CreateArticleRequest(
                "Face mask",
                200,
                "pcs",
                100
        );

        mockMvc.perform(post("/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("Face mask"))
                .andExpect(jsonPath("$.quantity").value(200))
                .andExpect(jsonPath("$.unit").value("pcs"))
                .andExpect(jsonPath("$.lowStockThreshold").value(100));
    }

    @Test
    void createArticle_invalidInput_returnsBadRequest() throws Exception {
        CreateArticleRequest request = new CreateArticleRequest(
                "",
                -5,
                "",
                -1
        );

        mockMvc.perform(post("/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("must")));
    }

    @Test
    void getAllArticles_returnsList() throws Exception {
        CreateArticleRequest request = new CreateArticleRequest("Gloves", 50, "box", 10);
        mockMvc.perform(post("/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/articles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Gloves"));
    }

    @Test
    void getArticleById_success() throws Exception {
        CreateArticleRequest request = new CreateArticleRequest("Thermometer", 5, "pcs", 2);
        String response = mockMvc.perform(post("/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Article created = objectMapper.readValue(response, Article.class);

        mockMvc.perform(get("/articles/" + created.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Thermometer"));
    }

    @Test
    void getArticleById_notFound_returns404() throws Exception {
        UUID fakeId = UUID.randomUUID();
        mockMvc.perform(get("/articles/" + fakeId))
                .andExpect(status().isNotFound())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Article not found")));
    }

    @Test
    void deleteArticle_success() throws Exception {
        CreateArticleRequest request = new CreateArticleRequest("Scalpel", 10, "pcs", 2);
        String response = mockMvc.perform(post("/articles")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andReturn()
                .getResponse()
                .getContentAsString();
        Article created = objectMapper.readValue(response, Article.class);

        mockMvc.perform(delete("/articles/" + created.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/articles/" + created.getId()))
                .andExpect(status().isNotFound());
    }

    @Test
    void deleteArticle_notFound_returns404() throws Exception {
        UUID fakeId = UUID.randomUUID();
        mockMvc.perform(delete("/articles/" + fakeId))
                .andExpect(status().isNotFound())
                .andExpect(content().string(org.hamcrest.Matchers.containsString("Article not found")));
    }

}
